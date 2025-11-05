import { ApiProperty } from "@nestjs/swagger";

/* -------------------------------------------------------
   DTO para representar un término de dirección (parte del nombre)
-------------------------------------------------------- */
export class GooglePredictionAddressTermDto {
    @ApiProperty({
        description: "Posición (offset) del término dentro de la descripción",
        example: 10,
    })
    offset!: number;

    @ApiProperty({
        description: "Valor textual del término",
        example: "Lima",
    })
    value!: string;
}

/* -------------------------------------------------------
   DTO para representar una dirección sugerida por Google Places
-------------------------------------------------------- */
export class GooglePredictionAddressDto {
    @ApiProperty({
        description: "Descripción completa de la dirección sugerida",
        example: "Av. Arequipa 1234, Lima, Perú",
    })
    description!: string;

    @ApiProperty({
        description: "Identificador único del lugar (Google Place ID)",
        example: "ChIJy0E6Yd1bLZERCaL7u1RykJk",
    })
    place_id!: string;

    @ApiProperty({
        description: "Referencia interna (puede variar según API de Google)",
        example: "place_id:ChIJy0E6Yd1bLZERCaL7u1RykJk",
    })
    reference!: string;

    @ApiProperty({
        description: "Lista de términos que componen la descripción",
        type: [GooglePredictionAddressTermDto],
    })
    terms!: GooglePredictionAddressTermDto[];

    @ApiProperty({
        description: "Tipos de lugar o etiquetas asociadas a la predicción",
        type: [String],
        example: ["street_address", "geocode"],
    })
    types!: string[];
}

/* -------------------------------------------------------
   DTO de respuesta principal para la API de Autocompletado de Google Places
-------------------------------------------------------- */
export class GooglePredictionDto {
    @ApiProperty({
        description: "Lista de direcciones sugeridas (predicciones)",
        type: [GooglePredictionAddressDto],
    })
    predictions!: GooglePredictionAddressDto[];

    @ApiProperty({
        description:
            "Estado de la respuesta según Google Places API (ej. OK, ZERO_RESULTS, OVER_QUERY_LIMIT)",
        example: "OK",
    })
    status!: string;
}
