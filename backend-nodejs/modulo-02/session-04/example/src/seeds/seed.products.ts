import { AppDataSource } from '../common/database/mysql-ormconfig';
import { Product } from '../product/product.entity';
import * as fs from 'fs';

(async () => {
	await AppDataSource.initialize();
	const repo = AppDataSource.getRepository(Product);

	const jsonData = fs.readFileSync('src/data/products.seed.json', 'utf-8');
	const products = JSON.parse(jsonData);

	for (const item of products) {
		const exists = await repo.findOneBy({ name: item.name });
		if (!exists) {
			await repo.save(repo.create(item));
			console.log(`Insertado: ${item.name}`);
		}
	}

	await AppDataSource.destroy();
})();
