import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PassengerRefreshTokenRequestDto {
    @ApiProperty({
        description: "Refresh token para obtener nuevos tokens de acceso",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
