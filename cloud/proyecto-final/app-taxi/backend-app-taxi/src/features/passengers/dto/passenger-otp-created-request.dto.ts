import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

/* -------------------------------------------------------
   DTO de Login (solo phone)
   - Formato esperado: E.164 SIN "+" ni símbolos (solo dígitos)
   - Ejemplo válido (Perú): "51987654321"
-------------------------------------------------------- */
export class PassengerOtpCreatedRequestDto {
    @ApiProperty({
        description: "Phone in E.164 without plus sign or symbols",
        example: "51987654321",
        minLength: 11,
        maxLength: 11,
        required: true,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value,
    ) // Recorta espacios
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
}
