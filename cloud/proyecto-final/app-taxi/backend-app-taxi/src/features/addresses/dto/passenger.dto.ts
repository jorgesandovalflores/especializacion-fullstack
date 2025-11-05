import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/* -------------------------------------------------------
   DTO de lectura para Address (1:1 con la entidad)
   - Usado típicamente como respuesta en controladores
-------------------------------------------------------- */
export class AddressDto {
    @ApiProperty({ description: "Address ID (UUID v4)", format: "uuid" })
    id!: string;

    @ApiProperty({
        description: "Passenger ID (UUID v4) al que pertenece la dirección",
        format: "uuid",
    })
    passengerId!: string;

    @ApiPropertyOptional({
        description: "Google Place ID (si aplica)",
        maxLength: 255,
        nullable: true,
    })
    placeId?: string | null;

    @ApiProperty({
        description: "Latitud geográfica (en grados decimales)",
        example: -12.046374,
    })
    latitude!: number;

    @ApiProperty({
        description: "Longitud geográfica (en grados decimales)",
        example: -77.042793,
    })
    longitude!: number;

    @ApiProperty({
        description:
            "Descripción legible de la dirección (texto visible para el usuario)",
        maxLength: 512,
        example: "Av. Arequipa 1234, Lima",
    })
    description!: string;

    @ApiProperty({
        description: "Fecha de creación del registro",
        type: String,
        format: "date-time",
        example: "2025-10-27T12:00:00.000Z",
    })
    createdAt!: Date;

    @ApiProperty({
        description: "Fecha de última actualización",
        type: String,
        format: "date-time",
        example: "2025-10-27T12:00:00.000Z",
    })
    updatedAt!: Date;

    @ApiPropertyOptional({
        description: "Fecha de eliminación lógica (si aplica)",
        type: String,
        format: "date-time",
        nullable: true,
    })
    deletedAt?: Date | null;
}
