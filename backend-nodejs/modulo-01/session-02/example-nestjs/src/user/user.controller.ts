import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    findAll() {
        return ['Juan', 'María', 'Luis'];
    }
}
