export default () => ({
    env: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    globalPrefix: process.env.GLOBAL_PREFIX,
});