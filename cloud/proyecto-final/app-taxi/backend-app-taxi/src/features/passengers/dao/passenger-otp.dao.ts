import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { PassengerOtpEntity } from "../entities/passenger-otp.entity";

@Injectable()
export class PassengerOtpDao {
    constructor(
        @InjectRepository(PassengerOtpEntity)
        private readonly repo: Repository<PassengerOtpEntity>,
    ) {}

    /** Crea un OTP con expiración. */
    async createOtp(
        passengerId: string,
        code: string,
        expiresAt: Date,
    ): Promise<PassengerOtpEntity> {
        const otp = this.repo.create({
            passengerId,
            code,
            expiresAt,
            used: false,
        });
        return this.repo.save(otp);
    }

    /** Busca un OTP vigente (no usado y no expirado). */
    async findValidOtp(
        passengerId: string,
        code: string,
    ): Promise<PassengerOtpEntity | null> {
        const now = new Date();
        return this.repo.findOne({
            where: { passengerId, code, used: false, expiresAt: MoreThan(now) },
        });
    }

    /** Marca el OTP como utilizado y setea usedAt = NOW(). */
    async markAsUsed(id: string): Promise<boolean> {
        const result = await this.repo
            .createQueryBuilder()
            .update(PassengerOtpEntity)
            .set({
                used: true,
                // MySQL NOW()
                usedAt: () => "NOW()",
            })
            .where("id_passenger_otp = :id", { id })
            .execute();

        return (result.affected ?? 0) > 0;
    }

    /** Soft delete de OTPs expirados. */
    async invalidateExpiredOtps(): Promise<number> {
        const now = new Date();
        const result = await this.repo
            .createQueryBuilder()
            .softDelete()
            .where("expires_at < :now", { now })
            .execute();

        return result.affected ?? 0;
    }
}
