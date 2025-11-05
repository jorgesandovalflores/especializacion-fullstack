import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import {
    AddressSearchResult,
    SearchOptions,
    IAddressRemote,
} from "../interfaces/address.interface";
import { NominatimRemote } from "../remote/nominatim.remote";
import { GoogleRemote } from "../remote/google.remote";

@Injectable()
export class AddressService {
    private readonly activeRemote: IAddressRemote;

    constructor(
        private readonly nominatimRemote: NominatimRemote,
        private readonly googleRemote: GoogleRemote,
    ) {
        this.activeRemote = this.selectActiveRemote();
    }

    async searchAddress(
        query: string,
        options: SearchOptions = {},
    ): Promise<AddressSearchResult[]> {
        if (!query?.trim()) {
            throw new HttpException(
                "Query is required",
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            return await this.activeRemote.search(query, options);
        } catch (error) {
            throw new HttpException(
                `Address search failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async searchInLima(
        query: string,
        limit: number = 10,
    ): Promise<AddressSearchResult[]> {
        const limaOptions: SearchOptions = {
            countryCodes: ["pe"],
            city: "Lima",
            limit,
            viewbox: {
                minLon: -77.2,
                minLat: -12.3,
                maxLon: -76.7,
                maxLat: -11.8,
            },
            locationBias: {
                lat: -12.046,
                lng: -77.043,
            },
            radius: 50000,
        };

        return this.searchAddress(query, limaOptions);
    }

    async getPlaceDetails(placeId: string, source: "nominatim" | "google") {
        try {
            if (source === "google" && "getDetails" in this.activeRemote) {
                return await (this.activeRemote as GoogleRemote).getDetails(
                    placeId,
                );
            }
            throw new Error(
                `Detail lookup not supported for source: ${source}`,
            );
        } catch (error) {
            throw new HttpException(
                `Detail lookup failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private selectActiveRemote(): IAddressRemote {
        const searchProvider =
            process.env.ADDRESS_SEARCH_PROVIDER || "nominatim";

        switch (searchProvider.toLowerCase()) {
            case "google":
                return this.googleRemote;
            case "nominatim":
            default:
                return this.nominatimRemote;
        }
    }

    getActiveProvider(): string {
        return this.activeRemote instanceof GoogleRemote
            ? "google"
            : "nominatim";
    }
}
