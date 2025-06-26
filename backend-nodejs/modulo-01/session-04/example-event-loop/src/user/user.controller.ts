import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly usersService: UserService) {}

	@Get('sync-block')
    blockingSync(): string {
        return this.usersService.blockingSync();
    }

    @Get('async-block')
    nonBlockingAsync(): Promise<string> {
        return this.usersService.nonBlockingAsync();
    }

    @Get('ping')
    ping(): string {
        console.log('🔁 Ping recibido');
        return 'pong';
    }

}