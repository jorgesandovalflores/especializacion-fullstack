import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity({ name: "entity_user" })
export class EntityUser {
    @PrimaryGeneratedColumn("uuid")
    id_user: string;

    @Column({ type: "varchar", length: 128, unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;
}