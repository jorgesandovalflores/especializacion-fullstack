import { AppDataSource } from '../typeorm.config';
import { User } from '../../features/users/entities/user.entity';
import * as argon2 from 'argon2';
import * as fs from 'fs';

(async () => {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const jsonData = fs.readFileSync('src/database/seed/data/users.json', 'utf-8');
	const users = JSON.parse(jsonData);
    for (const item of users) {
        const exists = await repo.findOneBy({ email: item.email });
        if (!exists) {
            await repo.save(repo.create({
                name: item.name,
                email: item.email,
                passwordHash: await argon2.hash(item.password),
                role: item.role,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
			console.log(`Usuario insertado: ${item.name}`);
        }
    }
    
    await AppDataSource.destroy();
})();
