import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { JwtAccessGuard } from "src/core/http/guards/jwt-access.guard";

@Controller("me")
@UseGuards(JwtAccessGuard)
export class MeController {
    constructor(private readonly subs: SubscriptionsService) {}

    @Get("subscriptions")
    async mySubscriptions(@Req() req: any) {
        const userId: string = req.user.sub;
        return this.subs.listByUser(userId);
    }
}
