import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { JwtAccessGuard } from "src/core/http/guards/jwt-access.guard";

@Controller("events/:id/subscribe")
@UseGuards(JwtAccessGuard)
export class SubscriptionsController {
    constructor(private readonly subs: SubscriptionsService) {}

    @Post()
    subscribe(@Param("id") eventId: string, @Req() req: any) {
        return this.subs.subscribe(req.user.sub, eventId);
    }
}
