import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Check,
} from "typeorm";
import { PassengerEntity } from "./passenger.entity";

@Entity({ name: "entity_passenger_otp" })
@Index("IX_passenger_otp_passenger_id", ["passengerId"])
@Index("IX_passenger_otp_passenger_code", ["passengerId", "code"])
@Index("IX_passenger_otp_expires_at", ["expiresAt"])
@Check("CHK_passenger_otp_code_format", "code REGEXP '^[0-9]{4,6}$'")
export class PassengerOtpEntity {
    /* ---------------------------------------
     PK UUID v4 almacenado como CHAR(36)
     --------------------------------------- */
    @PrimaryGeneratedColumn("uuid", { name: "id_passenger_otp" })
    id!: string;

    /* ---------------------------------------
     Relación con PassengerEntity
     --------------------------------------- */
    @ManyToOne(() => PassengerEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_passenger" })
    passenger!: PassengerEntity;

    @Column("uuid", { name: "id_passenger", nullable: false })
    passengerId!: string;

    /* ---------------------------------------
     Código OTP (4 a 6 dígitos)
     --------------------------------------- */
    @Column("varchar", {
        name: "code",
        length: 6, // admite 4 o 6 dígitos
        nullable: false,
        comment: "Código OTP para autenticación o verificación",
    })
    code!: string;

    /* ---------------------------------------
     Control de expiración y uso
     --------------------------------------- */
    @Column("datetime", {
        name: "expires_at",
        nullable: false,
        comment: "Fecha y hora de expiración del OTP",
    })
    expiresAt!: Date;

    @Column("boolean", {
        name: "used",
        default: false,
        comment: "Indica si el código ya fue utilizado",
    })
    used!: boolean;

    @Column("datetime", {
        name: "used_at",
        nullable: true,
        comment: "Fecha y hora en que se usó el OTP (si aplica)",
    })
    usedAt?: Date | null;

    /* ---------------------------------------
     Auditoría
     --------------------------------------- */
    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt!: Date;

    @DeleteDateColumn({
        name: "deleted_at",
        type: "datetime",
        nullable: true,
    })
    deletedAt?: Date | null;
}
