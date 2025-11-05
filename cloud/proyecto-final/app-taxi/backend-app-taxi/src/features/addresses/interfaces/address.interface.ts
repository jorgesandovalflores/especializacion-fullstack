export interface GeoCoordinates {
    lat: number;
    lng: number;
}

export interface AddressSearchResult {
    source: "nominatim" | "google";
    address: string;
    displayName: string;
    placeId: string;
    coordinates?: GeoCoordinates;
    needsDetailLookup: boolean;
    rawData?: any;
}

export interface SearchOptions {
    countryCodes?: string[];
    city?: string;
    limit?: number;
    viewbox?: {
        minLon: number;
        minLat: number;
        maxLon: number;
        maxLat: number;
    };
    locationBias?: GeoCoordinates;
    radius?: number;
}

export interface IAddressRemote {
    search(
        query: string,
        options?: SearchOptions,
    ): Promise<AddressSearchResult[]>;
    getDetails?(
        placeId: string,
    ): Promise<{ coordinates: GeoCoordinates; fullAddress: string }>;
}
