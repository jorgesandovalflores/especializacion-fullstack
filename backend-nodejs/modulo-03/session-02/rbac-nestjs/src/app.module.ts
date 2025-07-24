import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
			provide: APP_GUARD,
			useClass: RolesGuard
		}
  ],
})
export class AppModule {}
