import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
    IAddressRemote,
    AddressSearchResult,
    SearchOptions,
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
    private readonly baseUrl = "https://gisgraphy.alert.pe/search";

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
                this.httpService.get<NominatimResult[]>(this.baseUrl, {
                    params,
                    headers: { "User-Agent": "NestJS-Address-Searcher/1.0" },
                }),
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

    private buildQuery(query: string, city?: string): string {
        return city ? `${query} ${city}` : query;
    }
}
