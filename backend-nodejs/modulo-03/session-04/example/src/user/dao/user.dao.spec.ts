import { UserDao } from './user.dao';
import { Repository } from 'typeorm';

describe('UserDao', () => {
	let dao: UserDao;
	let mockRepo: Partial<Repository<any>>;

	beforeEach(() => {
		mockRepo = {
			findOne: jest.fn().mockResolvedValue({ email: 'test@mail.com' }),
		};

		dao = new UserDao(mockRepo as Repository<any>);
	});

	it('debe buscar usuario por email', async () => {
		const result = await dao.findByEmail('test@mail.com');
		expect(result?.email).toBe('test@mail.com');
	});
});
