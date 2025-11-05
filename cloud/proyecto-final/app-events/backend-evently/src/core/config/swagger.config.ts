export default () => ({
    swagger: {
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESC,
        version: process.env.SWAGGER_VERSION,
    },
});