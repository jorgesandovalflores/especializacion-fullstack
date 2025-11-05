import {
    Body,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
} from "@nestjs/common";
import {
    ApiBody,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { PassengerOtpCreatedRequestDto } from "../dto/passenger-otp-created-request.dto";
import { PassengerOtpValidatedRequestDto } from "../dto/passenger-otp-validated-request.dto";
import { PassengerLoginResponseDto } from "../dto/passenger-login-response.dto";
import { PassengerRefreshTokenRequestDto } from "../dto/passenger-refresh-token-request.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /* -------------------------------------------------------
     POST /auth/otp
     Genera y envía una OTP por SMS
  -------------------------------------------------------- */
    @Post("otp-generate")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Generate OTP and send via SMS" })
    @ApiBody({ type: PassengerOtpCreatedRequestDto })
    @ApiResponse({
        status: 200,
        description: "OTP created and sent",
        schema: {
            type: "object",
            properties: {
                success: { type: "boolean", example: true },
                expiresAt: {
                    type: "string",
                    example: "2025-10-06T03:15:22.000Z",
                },
                ttlSec: { type: "number", example: 300 },
                messageId: {
                    type: "string",
                    nullable: true,
                    example: "abc123",
                },
            },
        },
    })
    @ApiResponse({
        status: 422,
        description:
            "Business error (e.g., active code rate limit, delivery failed)",
    })
    async generateOtp(@Body() dto: PassengerOtpCreatedRequestDto): Promise<{
        success: boolean;
        expiresAt: string;
        ttlSec: number;
        messageId?: string | null;
    }> {
        // Idioma para i18n (toma el primer valor del header si viene lista)
        return this.authService.generateOtpByPhone(dto);
    }

    /* -------------------------------------------------------
     POST /auth/otp/validate
     Valida OTP y devuelve tokens + perfil
  -------------------------------------------------------- */
    @Post("otp-validate")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Validate OTP and return session tokens + user" })
    @ApiBody({ type: PassengerOtpValidatedRequestDto })
    @ApiResponse({
        status: 200,
        description:
            "OTP verified. Returns access and refresh tokens plus user",
        type: PassengerLoginResponseDto,
    })
    @ApiResponse({
        status: 422,
        description:
            "Business error (invalid or expired OTP, already used, user not exists)",
    })
    async validateOtp(
        @Body() dto: PassengerOtpValidatedRequestDto,
    ): Promise<PassengerLoginResponseDto> {
        return this.authService.verifyOtpByPhone(dto);
    }

    /* -------------------------------------------------------
   POST /auth/refresh
   Renueva los tokens de acceso usando un refresh token
  -------------------------------------------------------- */
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Refresh access token using refresh token" })
    @ApiBody({ type: PassengerRefreshTokenRequestDto })
    @ApiResponse({
        status: 200,
        description: "Tokens refreshed successfully",
        type: PassengerLoginResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: "Invalid or expired refresh token",
    })
    async refreshTokens(
        @Body() dto: PassengerRefreshTokenRequestDto,
    ): Promise<PassengerLoginResponseDto> {
        return this.authService.refreshTokens(dto);
    }
}
