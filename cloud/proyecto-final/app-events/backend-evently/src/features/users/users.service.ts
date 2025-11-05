import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
    ) {}

    findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    findByEmailWithPassword(email: string) {
        return this.repo
            .createQueryBuilder("u")
            .addSelect("u.passwordHash")
            .where("u.email = :email", { email })
            .getOne();
    }

    async create(partial: Partial<User>) {
        const entity = this.repo.create(partial);
        return this.repo.save(entity);
    }
}
