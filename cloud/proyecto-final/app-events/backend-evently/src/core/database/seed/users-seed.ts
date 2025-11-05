import * as path from "path";
import { promises as fs } from "fs";
import * as argon2 from "argon2";
import { AppDataSource } from "../typeorm.config";
import { User } from "src/features/users/entities/user.entity";
import { Role } from "src/core/http/enums/role.enum";

async function resolveUsersFile(): Promise<string> {
    const candidates = [
        path.resolve(__dirname, "data/users.json"),
        path.resolve(__dirname, "./data/users.json"),
        path.resolve(process.cwd(), "src/core/database/seed/data/users.json"),
        path.resolve(process.cwd(), "dist/core/database/seed/data/users.json"),
    ];

    for (const p of candidates) {
        try {
            await fs.access(p);
            return p;
        } catch {}
    }

    throw new Error(
        "Users seed file not found. Set SEED_PARAMETERS_FILE or place users.json in a known path.",
    );
}

export async function seedUser() {
    await AppDataSource.initialize();
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
        const filePath = await resolveUsersFile();
        const raw = await fs.readFile(filePath, "utf-8");
        const parameters: Array<{
            name: string;
            email: string;
            password: string;
            role: string;
        }> = JSON.parse(raw);

        const repo = runner.manager.getRepository(User);
        for (const item of parameters) {
            const exists = await repo.findOne({
                where: { email: item.email },
            });
            if (exists) {
                console.log(`PhoneNumber ya existía: ${exists.email}`);
                continue;
            }

            const passwordHash = await argon2.hash(item.password);
            await repo.insert({
                name: item.name,
                email: item.email,
                passwordHash: passwordHash,
                role: item.role as Role,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`email registrado: ${item.email}`);
        }
        await runner.commitTransaction();
        console.log("Seed de users completado - OK");
    } catch (err) {
        await runner.rollbackTransaction();
        console.error("Error en seed de users - FAILED", err);
        process.exitCode = 1;
    } finally {
        await runner.release();
        await AppDataSource.destroy();
    }
}
