import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
	it('debe fallar si el email no es válido', async () => {
		const dto = plainToInstance(CreateUserDto, { email: 'bad', password: '123456' });
		const errors = await validate(dto);
		expect(errors.length).toBeGreaterThan(0);
	});
});