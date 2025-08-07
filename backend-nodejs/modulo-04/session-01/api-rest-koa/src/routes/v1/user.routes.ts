import Router from 'koa-router'
import { getUsers, createUser } from '../../controllers/user.controller'

const router = new Router({ prefix: '/api/v1/users' })

router.get('/', getUsers)
router.post('/', createUser)

export default router