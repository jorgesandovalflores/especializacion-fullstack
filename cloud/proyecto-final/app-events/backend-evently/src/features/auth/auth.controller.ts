import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { JwtRefreshGuard } from "src/core/http/guards/jwt-refresh.guard";
import { JwtAccessGuard } from "src/core/http/guards/jwt-access.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post("register")
    register(@Body() dto: RegisterDto) {
        return this.auth.register(dto);
    }

    @Post("login")
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto);
    }

    @Post("refresh-token")
    @UseGuards(JwtRefreshGuard)
    refresh(@Req() req: any) {
        return this.auth.refresh(req.user);
    }

    @Post("logout")
    @UseGuards(JwtAccessGuard)
    logout(@Req() req: any) {
        return this.auth.logout(req.user);
    }
}
