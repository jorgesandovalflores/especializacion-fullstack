import * as path from "path";
import { promises as fs } from "fs";
import { AppDataSource } from "../typeorm.migration";
import { MenuEntity } from "src/features/menu/entities/menu.entity";
import { MenuApplication } from "src/features/menu/enum/menu-application.enum";
import { MenuStatus } from "src/features/menu/enum/menu-status.enum";

async function resolveUsersFile(): Promise<string> {
    const candidates = [
        path.resolve(__dirname, "data/menus.json"),
        path.resolve(__dirname, "./data/menus.json"),
        path.resolve(
            process.cwd(),
            "src/core/database/seeders/data/menus.json",
        ),
        path.resolve(
            process.cwd(),
            "dist/core/database/seeders/data/menus.json",
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

export async function seedMenus() {
    await AppDataSource.initialize();
    const runner = AppDataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
        const filePath = await resolveUsersFile();
        const raw = await fs.readFile(filePath, "utf-8");
        const parameters: Array<{
            key: string;
            text: string;
            iconUrl: string;
            deeplink: string;
            order: number;
            application: string;
            status: string;
        }> = JSON.parse(raw);

        const repo = runner.manager.getRepository(MenuEntity);

        for (const item of parameters) {
            const exists = await repo.findOne({
                where: { key: item.key },
            });
            if (exists) {
                console.log(`Menu item ya existía: ${exists.key}`);
                continue;
            }
            await repo.insert({
                key: item.key,
                text: item.text,
                iconUrl: item.iconUrl,
                deeplink: item.deeplink,
                order: item.order,
                application: item.application as MenuApplication,
                status: item.status as MenuStatus,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });

            console.log(`Menu item registrado: ${item.key}`);
        }

        await runner.commitTransaction();
        console.log("Seed de menu completado - OK");
    } catch (err) {
        await runner.rollbackTransaction();
        console.error("Error en seed de menu - FAILED", err);
        process.exitCode = 1;
    } finally {
        await runner.release();
        await AppDataSource.destroy();
    }
}
