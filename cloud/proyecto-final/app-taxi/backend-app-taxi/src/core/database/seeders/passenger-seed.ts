import * as path from "path";
import { promises as fs } from "fs";
import { AppDataSource } from "../typeorm.migration";
import { PassengerEntity } from "src/features/passengers/entities/passenger.entity";
import { PassengerStatus } from "src/features/passengers/enum/passenger-status.enum";

async function resolveUsersFile(): Promise<string> {
    const candidates = [
        path.resolve(__dirname, "data/passengers.json"),
        path.resolve(__dirname, "./data/passengers.json"),
        path.resolve(
            process.cwd(),
            "src/core/database/seeders/data/passengers.json",
        ),
        path.resolve(
            process.cwd(),
            "dist/core/database/seeders/data/passengers.json",
        ),
    ];

    for (const p of candidates) {
        try {
            await fs.access(p);
            return p;
        } catch {}
    }

    throw new Error(
        "Users seed file not found. Set SEED_PARAMETERS_FILE or place passengers.json in a known path.",
    );
}

export async function seedPassengers() {
    await AppDataSource.initialize();
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
        const filePath = await resolveUsersFile();
        const raw = await fs.readFile(filePath, "utf-8");
        const parameters: Array<{
            phoneNumber: string;
            givenName: string;
            familyName: string;
            email: string;
            photoUrl: string;
            status: string;
            lastLoginAt: string;
            createdAt: string;
            updatedAt: string;
            deletedAt: string;
        }> = JSON.parse(raw);

        const repo = runner.manager.getRepository(PassengerEntity);

        for (const item of parameters) {
            const exists = await repo.findOne({
                where: { phoneNumber: item.phoneNumber },
            });
            if (exists) {
                console.log(`PhoneNumber ya existía: ${exists.phoneNumber}`);
                continue;
            }
            await repo.insert({
                phoneNumber: item.phoneNumber,
                givenName: item.givenName,
                familyName: item.familyName,
                email: item.email,
                photoUrl: item.photoUrl,
                tokenFcm: null,
                status: item.status as PassengerStatus,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });

            console.log(`PhoneNumber registrado: ${item.phoneNumber}`);
        }

        await runner.commitTransaction();
        console.log("Seed de passengers completado - OK");
    } catch (err) {
        await runner.rollbackTransaction();
        console.error("Error en seed de passengers - FAILED", err);
        process.exitCode = 1;
    } finally {
        await runner.release();
        await AppDataSource.destroy();
    }
}
