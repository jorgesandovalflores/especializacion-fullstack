import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    Matches,
    IsOptional,
} from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

/* -------------------------------------------------------
   DTO de Validación de OTP (phone + code + tokenFcm)
   - Formato phone: E.164 SIN "+" ni símbolos (solo dígitos)
   - Formato code: 4 a 6 dígitos numéricos
   - Token FCM: Opcional para notificaciones push
-------------------------------------------------------- */
export class PassengerOtpValidatedRequestDto {
    @ApiProperty({
        description: "Phone in E.164 without plus sign or symbols",
        example: "51987654321",
        minLength: 11,
        maxLength: 11,
        required: true,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value,
    )
    @IsString({
        message: i18nValidationMessage("passenger.validation.isString"),
    })
    @IsNotEmpty({
        message: i18nValidationMessage("passenger.validation.required"),
    })
    @MinLength(11, {
        message: i18nValidationMessage("passenger.validation.minLength"),
    })
    @MaxLength(11, {
        message: i18nValidationMessage("passenger.validation.maxLength"),
    })
    phone!: string;

    @ApiProperty({
        description: "OTP code with 4 to 6 numeric digits",
        example: "1234",
        minLength: 4,
        maxLength: 6,
        required: true,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value,
    )
    @IsString({
        message: i18nValidationMessage("otp.validation.isString"),
    })
    @IsNotEmpty({
        message: i18nValidationMessage("otp.validation.required"),
    })
    @MinLength(4, {
        message: i18nValidationMessage("otp.validation.minLength"),
    })
    @MaxLength(6, {
        message: i18nValidationMessage("otp.validation.maxLength"),
    })
    @Matches(/^[0-9]{4,6}$/, {
        message: i18nValidationMessage("otp.validation.pattern"),
    })
    code!: string;

    @ApiProperty({
        description: "FCM token for push notifications",
        example: "fcm_token_string_here",
        required: false,
        nullable: true,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value,
    )
    @IsString({
        message: i18nValidationMessage("otp.validation.isString"),
    })
    @IsOptional()
    tokenFcm?: string;
}
