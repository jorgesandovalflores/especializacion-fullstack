import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { PassengerStatus } from "../enum/passenger-status.enum";

@Entity({ name: "entity_passenger" })
@Index("IDX_passenger_status", ["status"])
@Index("UQ_passenger_phone_number", ["phoneNumber"], { unique: true })
@Index("UQ_passenger_email", ["email"], { unique: true })
export class PassengerEntity {
    /* ---------------------------------------
       PK UUID v4 almacenado como CHAR(36)
       --------------------------------------- */
    @PrimaryGeneratedColumn("uuid", { name: "id_passenger" })
    id!: string;

    /* ---------------------------------------
       Dato de sesión principal: phone_number
       - Formato recomendado: E.164 (ej. "51xxxxxxxxx")
       - Único a nivel de tabla
       --------------------------------------- */
    @Column("varchar", {
        name: "phone_number",
        length: 20, // suficiente para E.164 (máx 15) con holgura
        nullable: false,
    })
    phoneNumber!: string;

    /* ---------------------------------------
       Datos personales básicos
       --------------------------------------- */

    @Column("varchar", { name: "given_name", length: 60, nullable: true })
    givenName?: string | null;

    @Column("varchar", { name: "family_name", length: 60, nullable: true })
    familyName?: string | null;

    @Column("varchar", {
        name: "email",
        length: 120,
        nullable: true,
    })
    email?: string | null;

    @Column("varchar", { name: "photo_url", length: 255, nullable: true })
    photoUrl?: string | null;

    /* ---------------------------------------
       Estado de negocio del pasajero
       --------------------------------------- */
    @Column({
        type: "enum",
        enum: PassengerStatus,
        name: "status",
        default: PassengerStatus.ACTIVE,
    })
    status!: PassengerStatus;

    /* ---------------------------------------
       Auditoría / sesión
       --------------------------------------- */
    @Column("datetime", {
        name: "last_login_at",
        nullable: true,
        comment: "Último inicio de sesión confirmado en servidor",
    })
    lastLoginAt?: Date | null;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date | null;
}
