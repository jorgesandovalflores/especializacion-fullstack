import { DataSource, DataSourceOptions } from "typeorm";
import "dotenv/config";

const options: DataSourceOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
    synchronize: false,
    logging: true,
    extra: {
        connectionLimit: Number(process.env.DB_POOL),
    },
};

export const AppDataSource = new DataSource(options);
export default options;
