import { FastifyRequest, FastifyReply } from 'fastify';

export function authorize(roles: string[]) {
	return async (req: FastifyRequest, reply: FastifyReply) => {
		const user = (req as any).user;
		if (!user || !roles.includes(user.role)) {
			reply.status(403).send({ message: 'Access denied' });
		}
	};
}