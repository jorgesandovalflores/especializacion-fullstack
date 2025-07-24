// src/server.ts
import Fastify from 'fastify';
import { authorize } from './middleware/authorize';

const app = Fastify();

// Simula autenticación
app.addHook('onRequest', async (req, _reply) => {
	(req as any).user = {
		id: 1,
		role: 'supervisor',
		permissions: ['view_reports']
	};
});

app.get('/profile', async (req, reply) => {
	reply.send({ message: 'Perfil público', user: (req as any).user });
});

app.get('/admin/users', {
	handler: async (req, reply) => {
		await authorize(['admin'])(req, reply);
		reply.send({ message: 'Solo para admins' });
	}
});

app.get('/reports', {
	handler: async (req, reply) => {
		await authorize(['admin', 'supervisor'])(req, reply);
		reply.send({ message: 'Vista de reportes' });
	}
});

app.listen({ port: 3001 }, () => {
	console.log('Fastify server http://localhost:3001');
});