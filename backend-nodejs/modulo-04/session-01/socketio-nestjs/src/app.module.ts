import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'

@Module({
    imports: [AuthModule, ChatModule],
})
export class AppModule {}
