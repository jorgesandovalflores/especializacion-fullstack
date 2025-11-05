import { Injectable, UnauthorizedException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpCustomException } from "src/core/http/exception/http.exception";
import { CacheService } from "src/core/cache/cache.service";

import { PassengerDao } from "../dao/passenger.dao";
import { PassengerOtpDao } from "../dao/passenger-otp.dao";
import { PassengerOtpCreatedRequestDto } from "../dto/passenger-otp-created-request.dto";
import { PassengerOtpValidatedRequestDto } from "../dto/passenger-otp-validated-request.dto";
import { PassengerLoginResponseDto } from "../dto/passenger-login-response.dto";
import { toPassengerDto } from "../mapper/passenger.mapper";

import BrevoNetwork from "../remote/BrevoNetwork";
import { PassengerRefreshTokenRequestDto } from "../dto/passenger-refresh-token-request.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly passengerDao: PassengerDao,
        private readonly passengerOtpDao: PassengerOtpDao,
        private readonly i18n: I18nService,
        private readonly cache: CacheService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService,
    ) {}

    /**
     * Genera y envía una OTP por SMS para autenticación por teléfono.
     * - Si el pasajero NO existe, se crea con estado INACTIVE_REGISTER.
     * - Rate limit por cache: 1 minuto por pasajero.
     * - TTL de la OTP configurable (OTP_TTL_SEC, por defecto 300s).
     */
    async generateOtpByPhone(
        request: PassengerOtpCreatedRequestDto,
        lang?: string,
    ): Promise<{
        success: boolean;
        expiresAt: string; // ISO
        ttlSec: number;
        messageId?: string | null;
    }> {
        const phone = request.phone.trim();

        // Buscar o crear pasajero (INACTIVE_REGISTER)
        let passenger = await this.passengerDao.findByPhoneNumber(phone);
        if (!passenger) {
            passenger = await this.passengerDao.createInactiveByPhone(phone);
        }

        // Rate limit: 1 minuto
        const rateTtlSec = Number(this.config.get("OTP_RATE_TTL_SEC") ?? 60);
        const rateKey = `otp:passenger:${passenger.id}:lock`;
        const rateActive = await this.cache.get<string>(rateKey);
        if (rateActive) {
            throw new HttpCustomException(
                await this.i18n.t("auth.activeCodeExists", { lang }),
                422,
            );
        }

        // OTP (4 dígitos)
        const code = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

        // Expiración
        const ttlSec = Number(this.config.get("OTP_TTL_SEC") ?? 120);
        const expiresAt = new Date(Date.now() + ttlSec * 1000);

        // Persistir OTP
        const otp = await this.passengerOtpDao.createOtp(
            passenger.id,
            code,
            expiresAt,
        );

        // Enviar SMS vía Brevo
        const messageId = await BrevoNetwork.sendSMS(
            passenger.phoneNumber,
            code,
        );
        if (!messageId) {
            throw new HttpCustomException(
                await this.i18n.t("auth.deliveryFailed", { lang }),
                422,
            );
        }

        // Rate limit cache
        await this.cache.set(rateKey, "1", rateTtlSec);

        return {
            success: true,
            expiresAt: otp.expiresAt.toISOString(),
            ttlSec,
            messageId,
        };
    }

    /**
     * Valida la OTP y devuelve tokens de sesión + perfil.
     * Reglas:
     * - Debe existir el pasajero por phone.
     * - OTP vigente (no usada y no expirada).
     * - Marca OTP como usada.
     * - Toca lastLoginAt.
     * - Emite access_token y refresh_token.
     */
    async verifyOtpByPhone(
        request: PassengerOtpValidatedRequestDto,
        lang?: string,
    ): Promise<PassengerLoginResponseDto> {
        const phone = request.phone.trim();
        const code = String(request.code || "").trim();

        if (!code) {
            throw new HttpCustomException(
                await this.i18n.t("auth.codeRequired", { lang }),
                422,
            );
        }

        // 1) Buscar pasajero
        const passenger = await this.passengerDao.findByPhoneNumber(phone);
        if (!passenger) {
            throw new HttpCustomException(
                await this.i18n.t("auth.passenger.notExists", { lang }),
                422,
            );
        }

        // 2) OTP vigente
        const otp = await this.passengerOtpDao.findValidOtp(passenger.id, code);
        if (!otp) {
            throw new HttpCustomException(
                await this.i18n.t("auth.invalidOrExpired", { lang }),
                422,
            );
        }

        // 3) Marcar OTP como usada
        const marked = await this.passengerOtpDao.markAsUsed(otp.id);
        if (!marked) {
            throw new HttpCustomException(
                await this.i18n.t("auth.alreadyUsed", { lang }),
                422,
            );
        }

        // 4) Tocar lastLoginAt
        await this.passengerDao.touchLastLoginAtById(passenger.id);

        // 5) Emitir JWTs
        const accessTtlSec = Number(this.config.get("JWT_ACCESS_TTL_SEC"));
        const refreshTtlSec = Number(this.config.get("JWT_REFRESH_TTL_SEC"));
        const accessSecret = this.config.get<string>("JWT_ACCESS_SECRET");
        const refreshSecret = this.config.get<string>("JWT_REFRESH_SECRET");

        const basePayload = {
            sub: passenger.id,
            typ: "passenger",
            id: passenger.id,
        };

        const accessToken = await this.jwt.signAsync(basePayload, {
            secret: accessSecret,
            expiresIn: accessTtlSec,
        });

        const refreshToken = await this.jwt.signAsync(
            { ...basePayload, rt: true },
            {
                secret: refreshSecret,
                expiresIn: refreshTtlSec,
            },
        );

        // 6) Liberar rate-limit
        const rateKey = `otp:passenger:${passenger.id}:lock`;
        await this.cache.del(rateKey);

        // 7) Responder DTO
        return {
            accessToken,
            refreshToken,
            user: toPassengerDto(passenger),
        };
    }

    async refreshTokens(
        request: PassengerRefreshTokenRequestDto,
        lang?: string,
    ): Promise<PassengerLoginResponseDto> {
        const { refreshToken } = request;

        try {
            // 1) Verificar y decodificar el refresh token
            const refreshSecret = this.config.get<string>("JWT_REFRESH_SECRET");
            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: refreshSecret,
            });

            // 2) Validar que sea un refresh token
            if (!payload.rt) {
                throw new UnauthorizedException(
                    await this.i18n.t("auth.invalidRefreshToken", { lang }),
                );
            }

            // 3) Verificar que el pasajero existe
            const passenger = await this.passengerDao.findById(payload.sub);
            if (!passenger) {
                throw new UnauthorizedException(
                    await this.i18n.t("auth.passenger.notExists", { lang }),
                );
            }

            // 4) Opcional: Verificar si el token está en blacklist (para logout)
            const blacklisted = await this.cache.get<string>(
                `refresh_token:blacklist:${refreshToken}`,
            );
            if (blacklisted) {
                throw new UnauthorizedException(
                    await this.i18n.t("auth.refreshTokenRevoked", { lang }),
                );
            }

            // 5) Generar nuevos tokens
            const accessTtlSec = Number(this.config.get("JWT_ACCESS_TTL_SEC"));
            const refreshTtlSec = Number(
                this.config.get("JWT_REFRESH_TTL_SEC"),
            );
            const accessSecret = this.config.get<string>("JWT_ACCESS_SECRET");

            const basePayload = {
                sub: passenger.id,
                typ: "passenger",
                id: passenger.id,
            };

            const newAccessToken = await this.jwt.signAsync(basePayload, {
                secret: accessSecret,
                expiresIn: accessTtlSec,
            });

            const newRefreshToken = await this.jwt.signAsync(
                { ...basePayload, rt: true },
                {
                    secret: refreshSecret,
                    expiresIn: refreshTtlSec,
                },
            );

            // 6) Actualizar lastLoginAt
            await this.passengerDao.touchLastLoginAtById(passenger.id);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: toPassengerDto(passenger),
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            // JWT verification failed (expired, invalid, etc.)
            throw new UnauthorizedException(
                await this.i18n.t("auth.invalidRefreshToken", { lang }),
            );
        }
    }
}
