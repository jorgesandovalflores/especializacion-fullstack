import { PassengerDto } from "../dto/passenger.dto";
import { PassengerEntity } from "../entities/passenger.entity";

export const toPassengerDto = (entity: PassengerEntity): PassengerDto => {
    return {
        id: entity.id,
        phoneNumber: entity.phoneNumber,
        givenName: entity.givenName ?? null,
        familyName: entity.familyName ?? null,
        email: entity.email ?? null,
        photoUrl: entity.photoUrl ?? null,
        status: entity.status,
    };
};
