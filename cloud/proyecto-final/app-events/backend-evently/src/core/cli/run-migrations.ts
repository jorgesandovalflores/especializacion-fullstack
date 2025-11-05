import { AppDataSource } from "../database/migration.config";

async function main() {
    await AppDataSource.initialize();
    try {
        console.log("[migrate] running pending migrations…");
        const res = await AppDataSource.runMigrations();
        console.log(`[migrate] done. Executed: ${res.length}`);
    } finally {
        await AppDataSource.destroy();
    }
}

main().catch((err) => {
    console.error("[migrate] failed:", err);
    process.exit(1);
});
