// Placeholder de despliegue: el pipeline de CI/CD reemplaza este paquete por
// el build real de "login-backend" (NestJS) adaptado a Cloud Run functions.
// Este handler solo prueba que la función se despliega e invoca correctamente.
const functions = require("@google-cloud/functions-framework");

functions.http("handler", (req, res) => {
  res.status(200).json({
    message: "login-backend placeholder Cloud Run function",
    path: req.path,
  });
});
