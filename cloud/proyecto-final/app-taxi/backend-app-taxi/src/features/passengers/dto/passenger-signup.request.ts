// passenger-signup.request.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail, MaxLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

/* -------------------------------------------------------
   DTO de actualización de perfil de pasajero
   - givenName, familyName y email son requeridos
   - photoUrl es opcional
   - Se aplica trim() y validación de formato
-------------------------------------------------------- */
export class PassengerSignUpRequest {
    @ApiProperty({
        description: "Given name",
        example: "Jorge",
        maxLength: 60,
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
    @MaxLength(60, {
        message: i18nValidationMessage("passenger.validation.maxLength"),
    })
    givenName!: string;

    @ApiProperty({
        description: "Family name",
        example: "Sandoval",
        maxLength: 60,
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
    @MaxLength(60, {
        message: i18nValidationMessage("passenger.validation.maxLength"),
    })
    familyName!: string;

    @ApiProperty({
        description: "Email address",
        example: "jorge@identity.pe",
        maxLength: 120,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim().toLowerCase() : value,
    )
    @IsEmail(
        {},
        {
            message: i18nValidationMessage("passenger.validation.email"),
        },
    )
    @IsNotEmpty({
        message: i18nValidationMessage("passenger.validation.required"),
    })
    @MaxLength(120, {
        message: i18nValidationMessage("passenger.validation.maxLength"),
    })
    email!: string;

    @ApiPropertyOptional({
        description: "Photo URL",
        example: "https://cdn.identity.pe/avatars/jorge.jpg",
        maxLength: 255,
    })
    @Transform(({ value }) =>
        typeof value === "string" ? value.trim() : value,
    )
    @IsString({
        message: i18nValidationMessage("passenger.validation.isString"),
    })
    @MaxLength(255, {
        message: i18nValidationMessage("passenger.validation.maxLength"),
    })
    photoUrl?: string | null;
}
