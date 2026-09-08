// Placeholder de despliegue: el pipeline de CI/CD reemplaza este paquete por
// el build real de "login-backend" (NestJS) envuelto para Lambda (por ejemplo
// con @vendia/serverless-express). Este handler solo prueba que la
// integración API Gateway -> Lambda funciona de punta a punta.
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: "login-backend placeholder Lambda",
      path: event.rawPath,
    }),
  };
};
