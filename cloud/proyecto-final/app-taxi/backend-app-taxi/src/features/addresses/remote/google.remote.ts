import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
    IAddressRemote,
    AddressSearchResult,
    SearchOptions,
    GeoCoordinates,
    ModelGoogleGeocode,
} from "../interfaces/address.interface";

interface GoogleAutocompleteResult {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
    types: string[];
}

@Injectable()
export class GoogleRemote implements IAddressRemote {
    private readonly autocompleteUrl =
        "https://maps.googleapis.com/maps/api/place/autocomplete/json";
    private readonly detailsUrl =
        "https://maps.googleapis.com/maps/api/place/details/json";
    private readonly geocodeUrl =
        "https://maps.googleapis.com/maps/api/geocode/json";
    private readonly apiKey: string;

    constructor(private readonly httpService: HttpService) {
        this.apiKey = process.env.GOOGLE_API_KEY ?? "";
    }

    async search(
        query: string,
        options: SearchOptions = {},
    ): Promise<AddressSearchResult[]> {
        if (!this.apiKey) {
            throw new Error("Google API key not configured");
        }

        try {
            console.log("step 01");

            const params: Record<string, string> = {
                input: this.buildQuery(query, options.city),
                key: this.apiKey,
                language: "es",
                types: "address",
            };

            if (options.locationBias) {
                params.location = `${options.locationBias.lat},${options.locationBias.lng}`;
                params.radius = (options.radius || 50000).toString();
            }

            if (options.countryCodes?.length) {
                params.components = `country:${options.countryCodes[0]}`;
            }

            const response = await firstValueFrom(
                this.httpService.get<{
                    predictions: GoogleAutocompleteResult[];
                }>(this.autocompleteUrl, { params }),
            );

            console.log(response.request);
            return response.data.predictions.map(
                (prediction): AddressSearchResult => ({
                    source: "google",
                    address: prediction.structured_formatting.main_text,
                    displayName: prediction.description,
                    placeId: prediction.place_id,
                    coordinates: undefined,
                    needsDetailLookup: true,
                    rawData: prediction,
                }),
            );
        } catch (error) {
            console.error("Google Autocomplete search error:", error);
            throw new Error(
                `Google Autocomplete search failed: ${error.message}`,
            );
        }
    }

    async getDetails(
        placeId: string,
    ): Promise<{ coordinates: GeoCoordinates; fullAddress: string }> {
        if (!this.apiKey) {
            throw new Error("Google API key not configured");
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get<{
                    result: {
                        geometry: { location: { lat: number; lng: number } };
                        formatted_address: string;
                    };
                }>(this.detailsUrl, {
                    params: {
                        place_id: placeId,
                        key: this.apiKey,
                        language: "es",
                        fields: "geometry,formatted_address",
                    },
                }),
            );

            const { geometry, formatted_address } = response.data.result;

            return {
                coordinates: {
                    lat: geometry.location.lat,
                    lng: geometry.location.lng,
                },
                fullAddress: formatted_address,
            };
        } catch (error) {
            throw new Error(
                `Google Places detail lookup failed: ${error.message}`,
            );
        }
    }

    async getGeocode(latlng: string): Promise<ModelGoogleGeocode> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(
                    `${this.geocodeUrl}?key=${String(
                        process.env.APIKEY_GOOGLE_API,
                    )}&latlng=${latlng}`,
                ),
            );

            // Filtrar resultados que no contengan address_components con tipo "plus_code"
            const filteredResults = response.data.results.filter(
                (r: any) =>
                    !r.address_components.some((ac: any) =>
                        ac.types.includes("plus_code"),
                    ),
            );

            return {
                ...response.data,
                results: filteredResults,
            };
        } catch (error) {
            console.error("Google geocode error:", error);
            return {
                plus_code: {
                    compound_code: "",
                    global_code: "",
                },
                status: "",
                results: [],
            };
        }
    }

    private buildQuery(query: string, city?: string): string {
        return city ? `${query}` : query;
    }
}
