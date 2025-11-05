import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { PassengerEntity } from "../entities/passenger.entity";
import { PassengerStatus } from "../enum/passenger-status.enum";

@Injectable()
export class PassengerDao {
    constructor(
        @InjectRepository(PassengerEntity)
        private readonly repo: Repository<PassengerEntity>,
    ) {}

    /** Busca por phone_number (sin incluir borrados lógicos de forma explícita). */
    async findByPhoneNumber(
        phoneNumber: string,
    ): Promise<PassengerEntity | null> {
        const normalized = phoneNumber.trim();
        return this.repo.findOne({ where: { phoneNumber: normalized } });
    }

    /** Crea un pasajero INACTIVE_REGISTER solo con phone_number. */
    async createInactiveByPhone(phoneNumber: string): Promise<PassengerEntity> {
        const normalized = phoneNumber.trim();
        const entity = this.repo.create({
            phoneNumber: normalized,
            status: PassengerStatus.INACTIVE_REGISTER,
        } as Partial<PassengerEntity>);

        try {
            return await this.repo.save(entity);
        } catch (err: any) {
            // Condición de carrera: si alguien lo creó en paralelo por unique(phone)
            // MySQL duplicate key
            if (err?.code === "ER_DUP_ENTRY") {
                const existing = await this.findByPhoneNumber(normalized);
                if (existing) return existing;
            }
            throw err;
        }
    }

    /** Actualiza la última fecha de login (NOW()) por id. Devuelve true si afectó una fila. */
    async touchLastLoginAtById(id: string): Promise<boolean> {
        const result = await this.repo
            .createQueryBuilder()
            .update(PassengerEntity)
            .set({ lastLoginAt: () => "NOW()" }) // MySQL NOW()
            .where("id = :id", { id })
            .execute();

        return (result.affected ?? 0) > 0;
    }

    async updateBasicInfoById(
        id: string,
        givenName?: string | null,
        familyName?: string | null,
        email?: string | null,
        photoUrl?: string | null,
    ): Promise<boolean> {
        const result = await this.repo
            .createQueryBuilder()
            .update(PassengerEntity)
            .set({
                givenName,
                familyName,
                email,
                photoUrl,
            })
            .where("id = :id", { id })
            .execute();

        return (result.affected ?? 0) > 0;
    }

    /** Busca por id. */
    async findById(id: string): Promise<PassengerEntity | null> {
        return this.repo.findOne({ where: { id } });
    }

    /** Busca por email normalizado (lowercase/trim). */
    async findByEmail(email: string): Promise<PassengerEntity | null> {
        const normalized = email.trim().toLowerCase();
        return this.repo.findOne({ where: { email: normalized } });
    }

    /**
     * Verifica unicidad de email para update (excluye al propio id).
     * Devuelve true si el email ya está en uso por OTRO pasajero.
     */
    async isEmailTakenByAnother(id: string, email: string): Promise<boolean> {
        const normalized = email.trim().toLowerCase();
        const found = await this.repo.findOne({
            where: { email: normalized, id: Not(id) },
        });
        return !!found;
    }

    /**
     * Actualiza info básica y retorna la entidad actualizada.
     * Nota: usa update() + recarga, manteniendo compatibilidad con tu método existente.
     */
    async updateBasicInfoAndReturn(
        id: string,
        givenName?: string | null,
        familyName?: string | null,
        email?: string | null,
        photoUrl?: string | null,
    ): Promise<PassengerEntity | null> {
        await this.repo
            .createQueryBuilder()
            .update(PassengerEntity)
            .set({
                givenName,
                familyName,
                email: email ? email.trim().toLowerCase() : null,
                photoUrl,
                status: PassengerStatus.ACTIVE,
            })
            .where("id = :id", { id })
            .execute();

        return this.findById(id);
    }
}
