import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('me')
@UseGuards(JwtAccessGuard)
export class MeController {
  constructor(private readonly subs: SubscriptionsService) {}

  @Get('subscriptions')
  async mySubscriptions(@Req() req: any) {
    const userId: string = req.user.sub;
    return this.subs.listByUser(userId);
  }
}
