import { Injectable } from "@nestjs/common";
import { UserDao } from "../dao/user.dao";

@Injectable()
export class UserService {
  constructor(private readonly dao: UserDao) {}

    async findByEmail(email: string) {
        const exists = await this.dao.findByEmail(email);
        if (exists) throw new Error('Email ya registrado');
        return exists
    }
}