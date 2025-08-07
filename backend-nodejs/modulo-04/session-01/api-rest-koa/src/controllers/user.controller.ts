import { Context } from 'koa'
import { UserService } from '../services/user.service'
import { successResponse } from '../utils/response'

export const getUsers = async (ctx: Context) => {
	const users = await UserService.getAll()
	ctx.body = successResponse(users)
}

export const createUser = async (ctx: Context) => {
	const user = await UserService.create(ctx.request.ctx)
	ctx.status = 201
	ctx.body = successResponse(user, 'Usuario creado correctamente')
}