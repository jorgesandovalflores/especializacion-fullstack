import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PassengerStatus } from "../enum/passenger-status.enum";

/* -------------------------------------------------------
   DTO de lectura para Passenger (1:1 con la entidad)
   - Usado típicamente como respuesta en controladores
-------------------------------------------------------- */
export class PassengerDto {
    @ApiProperty({ description: "Passenger ID (UUID v4)", format: "uuid" })
    id!: string;

    @ApiProperty({
        description:
            "Phone number in E.164 without plus sign or symbols (e.g., 51987654321)",
        maxLength: 20,
    })
    phoneNumber!: string;

    @ApiPropertyOptional({ description: "Given name" })
    givenName?: string | null;

    @ApiPropertyOptional({ description: "Family name" })
    familyName?: string | null;

    @ApiPropertyOptional({ description: "Email address" })
    email?: string | null;

    @ApiPropertyOptional({ description: "Photo URL" })
    photoUrl?: string | null;

    @ApiProperty({
        description: "Business status",
        enum: PassengerStatus,
        enumName: "PassengerStatus",
        default: PassengerStatus.ACTIVE,
    })
    status!: PassengerStatus;
}
