import { ApiProperty } from "@nestjs/swagger";
import { PassengerDto } from "./passenger.dto";

/* -------------------------------------------------------
   Respuesta de login para Passenger
   - Incluye user, access_token y refresh_token
-------------------------------------------------------- */
export class PassengerLoginResponseDto {
    @ApiProperty({ description: "Bearer access token (JWT)" })
    accessToken!: string;

    @ApiProperty({ description: "Refresh token (JWT)" })
    refreshToken!: string;

    @ApiProperty({ description: "Authenticated passenger profile" })
    user!: PassengerDto;
}
