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

export type ModelGoogleGeocode = {
    plus_code: GoogleGeocodePlusCode;
    status: string;
    results: GoogleGeocodeResult[];
};

export type GoogleGeocodePlusCode = {
    compound_code: string;
    global_code: string;
};

export type GoogleGeocodeResult = {
    place_id: string;
    formatted_address: string;
    address_components: GoogleGeocodeResultAddress[];
};

export type GoogleGeocodeResultAddress = {
    long_name: string;
    short_name: string;
    types: string[];
};
