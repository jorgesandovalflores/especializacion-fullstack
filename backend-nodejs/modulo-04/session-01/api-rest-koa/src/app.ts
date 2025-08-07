import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import userRoutes from './routes/v1/user.routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = new Koa()

app.use(errorMiddleware)
app.use(bodyParser())
app.use(userRoutes.routes()).use(userRoutes.allowedMethods())

export { app }