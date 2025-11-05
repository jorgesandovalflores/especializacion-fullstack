// Comentario: modelo simple para tipar el viaje
export type TripStatus = 'PENDING' | 'ASSIGNED' | 'CANCELLED' | 'COMPLETED';

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface Trip {
    id: string;
    passengerName: string;
    pickup: Location;
    dropoff: Location;
    requestedAt: string; // ISO-8601
    status: TripStatus;
}
