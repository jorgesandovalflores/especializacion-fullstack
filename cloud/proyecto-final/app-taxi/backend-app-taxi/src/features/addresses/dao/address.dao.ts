import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AddressEntity } from "../entities/address.entity";

@Injectable()
export class AddressDao extends Repository<AddressEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(AddressEntity, dataSource.createEntityManager());
    }

    /**
     * Lista las 10 últimas direcciones del pasajero
     * ordenadas por fecha de actualización (descendente)
     *
     * @param passengerId - ID del pasajero (entity_passenger.id)
     */
    async listLastTenByPassenger(
        passengerId: string,
    ): Promise<AddressEntity[]> {
        return this.createQueryBuilder("addr")
            .where("addr.deleted_at IS NULL")
            .andWhere("addr.passenger_id = :passengerId", { passengerId })
            .orderBy("addr.updated_at", "DESC")
            .take(10)
            .getMany();
    }
}
