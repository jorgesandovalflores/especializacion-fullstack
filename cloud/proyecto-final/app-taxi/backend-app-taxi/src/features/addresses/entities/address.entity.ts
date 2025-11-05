import { PassengerEntity } from "src/features/passengers/entities/passenger.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

@Entity({ name: "entity_address" })
@Index("IDX_address_place_id", ["placeId"])
@Index("IDX_address_passenger_id", ["passengerId"])
export class AddressEntity {
    /* ---------------------------------------
       PK UUID v4 almacenado como CHAR(36)
       --------------------------------------- */
    @PrimaryGeneratedColumn("uuid", { name: "id_address" })
    id!: string;

    @Column("char", {
        name: "passenger_id",
        length: 36,
        nullable: false,
    })
    passengerId!: string;

    @ManyToOne(() => PassengerEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "passenger_id", referencedColumnName: "id" })
    passenger!: PassengerEntity;

    @Column("varchar", {
        name: "place_id",
        length: 255,
        nullable: true,
    })
    placeId!: string;

    @Column({ type: "double" })
    latitude: number;

    @Column({ type: "double" })
    longitude: number;

    @Column("varchar", { length: 512, name: "description" })
    description: string;

    /* ---------------------------------------
       Auditoría / sesión
       --------------------------------------- */

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date | null;
}
