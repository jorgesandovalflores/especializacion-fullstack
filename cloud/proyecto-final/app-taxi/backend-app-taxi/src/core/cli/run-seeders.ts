import { seedMenus } from "../database/seeders/menu-seed";
import { seedPassengers } from "../database/seeders/passenger-seed";

async function main() {
    try {
        console.log("[seed] running pending seeds");
        await seedPassengers();
        await seedMenus();
        console.log("[seed] done. Executed");
    } catch (err) {
        console.error("[seed] failed:", err);
        process.exit(1);
    }
}

main();
