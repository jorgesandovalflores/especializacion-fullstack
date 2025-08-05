import { Body, Controller, Post, Query } from "@nestjs/common";
import { UserService } from "../service/user.service";

@Controller('users')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    findById(@Query('email') email: string) {
        return this.service.findByEmail(email);
    }
}