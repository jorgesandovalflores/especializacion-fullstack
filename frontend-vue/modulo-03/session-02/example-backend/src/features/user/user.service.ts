import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private users: User[] = [{
        id: 1,
        name: 'Jorge',
        email: 'jorge@quebuu.com',
        password: '123456',
        role: 'ADMIN'
    }];
    private counter = 1;

    constructor(private jwtService: JwtService) {}

    create(dto: CreateUserDto) {
        const user: User = {
            id: this.counter++,
            name: dto.name,
            email: dto.email,
            password: dto.password,
            role: dto.role
        };
        this.users.push(user);
        return user;
    }

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(u => u.id === id);
    }

    update(id: number, dto: CreateUserDto) {
        const user = this.findOne(id);
        if (user) Object.assign(user, dto);
        return user;
    }

    remove(id: number) {
        const index = this.users.findIndex(u => u.id === id);
        if (index >= 0) this.users.splice(index, 1);
    }

    login(dto: LoginUserDto) {
        const user = this.users.find(u => u.email === dto.email && u.password === dto.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwtService.sign({ sub: user.id, role: user.role });
        return { token, user: { name: user.email, role: user.role } };
    }
}