export default () => ({
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME,
        logging: (process.env.DB_LOGGING ?? 'true') === 'true',
        synchronize: (process.env.DB_SYNCHRONIZE ?? 'false') === 'true',
    },
});