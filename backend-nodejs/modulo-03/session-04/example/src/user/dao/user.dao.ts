import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { EntityUser } from "../entities/user.entity";

@Injectable()
export class UserDao {
	constructor(private readonly repo: Repository<EntityUser>) {}

	findByEmail(email: string) {
		return this.repo.findOne({ where: { email } });
	}
}