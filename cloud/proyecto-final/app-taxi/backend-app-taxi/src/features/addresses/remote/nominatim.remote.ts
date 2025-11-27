import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
    IAddressRemote,
    AddressSearchResult,
    SearchOptions,
    ModelGoogleGeocode,
    GoogleGeocodeResult,
    GoogleGeocodeResultAddress,
} from "../interfaces/address.interface";

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    class?: string;
    type?: string;
    importance?: number;
}

@Injectable()
export class NominatimRemote implements IAddressRemote {
    private readonly baseUrl = process.env.URL_SERVER_NOMINATIM;

    constructor(private readonly httpService: HttpService) {}

    async search(
        query: string,
        options: SearchOptions = {},
    ): Promise<AddressSearchResult[]> {
        try {
            const params: Record<string, string> = {
                q: this.buildQuery(query, options.city),
                format: "json",
                limit: (options.limit || 10).toString(),
                addressdetails: "1",
            };

            if (options.countryCodes?.length) {
                params.countrycodes = options.countryCodes.join(",");
            }

            if (options.viewbox) {
                const { minLon, minLat, maxLon, maxLat } = options.viewbox;
                params.viewbox = `${minLon},${minLat},${maxLon},${maxLat}`;
                params.bounded = "1";
            }

            const response = await firstValueFrom(
                this.httpService.get<NominatimResult[]>(
                    `${this.baseUrl}/search`,
                    {
                        params,
                        headers: {
                            "User-Agent": "NestJS-Address-Searcher/1.0",
                        },
                    },
                ),
            );

            return response.data.map(
                (item): AddressSearchResult => ({
                    source: "nominatim",
                    address: item.display_name,
                    displayName: item.display_name,
                    placeId: item.place_id.toString(),
                    coordinates: {
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon),
                    },
                    needsDetailLookup: false,
                    rawData: item,
                }),
            );
        } catch (error) {
            console.error("Nominatim search error:", error);
            throw new Error(`Nominatim search failed: ${error.message}`);
        }
    }

    async getGeocode(latlng: string): Promise<ModelGoogleGeocode> {
        try {
            const [lat, lon] = latlng.split(",").map(Number);
            const response = await firstValueFrom(
                await this.httpService.get(`${this.baseUrl}/reverse`, {
                    params: {
                        format: "json",
                        limit: 1,
                        addressdetails: 1,
                        zoom: 18,
                        lat,
                        lon,
                    },
                }),
            );

            const nominatim = response.data;
            const address_components: GoogleGeocodeResultAddress[] = [];
            const addressMap: { [key: string]: string[] } = {
                road: ["route"],
                suburb: ["sublocality"],
                city: ["locality"],
                region: ["administrative_area_level_2"],
                state: ["administrative_area_level_1"],
                postcode: ["postal_code"],
                country: ["country"],
            };

            for (const [key, types] of Object.entries(addressMap)) {
                if (nominatim.address[key]) {
                    address_components.push({
                        long_name: nominatim.address[key],
                        short_name: "",
                        types,
                    });
                }
            }

            const result: GoogleGeocodeResult = {
                place_id: String(nominatim.place_id),
                formatted_address: nominatim.display_name,
                address_components,
            };

            const model: ModelGoogleGeocode = {
                status: "OK",
                results: [result],
                plus_code: {
                    compound_code: "",
                    global_code: "",
                },
            };
            return model;
        } catch (error) {
            console.error("Nominatim geocode error:", error);
            return {
                status: "",
                results: [],
                plus_code: {
                    compound_code: "",
                    global_code: "",
                },
            };
        }
    }

    private buildQuery(query: string, city?: string): string {
        return city ? `${query} ${city}` : query;
    }
}
