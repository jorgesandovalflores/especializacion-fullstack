import { seedUser } from "../database/seed/users-seed";

async function main() {
    try {
        console.log("[seed] running pending seeds");
        await seedUser();
        console.log("[seed] done. Executed");
    } catch (err) {
        console.error("[seed] failed:", err);
        process.exit(1);
    }
}

main();
