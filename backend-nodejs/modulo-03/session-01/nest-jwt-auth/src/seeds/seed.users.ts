import { AppDataSource } from '../common/database/mysql-ormconfig';
import { Users } from '../features/users/users.entity';
import * as argon2 from 'argon2';
import * as fs from 'fs';

(async () => {
	await AppDataSource.initialize();
	const repo = AppDataSource.getRepository(Users);

	const jsonData = fs.readFileSync('src/data/users.seed.json', 'utf-8');
	const products = JSON.parse(jsonData);

	for (const item of products) {
		const exists = await repo.findOneBy({ email: item.email });
		if (!exists) {
			const hash = await argon2.hash(item.password);
			item.password = hash
			await repo.save(repo.create(item));
			console.log(`Insertado: ${item.name}`);
		}
	}

	await AppDataSource.destroy();
})();
