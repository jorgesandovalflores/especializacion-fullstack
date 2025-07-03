import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserPostgresService {
	constructor(@Inject('POSTGRES_POOL') private pool: Pool) {}

	async findAll() {
		const { rows } = await this.pool.query('SELECT * FROM users');
		return rows;
	}

	async findOne(id: number) {
		const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
		return rows[0];
	}

	async create(data: { name: string; email: string }) {
		const result = await this.pool.query(
			'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
			[data.name, data.email],
		);
		return result.rows[0];
	}

	async update(id: number, data: { name: string; email: string }) {
		await this.pool.query(
			'UPDATE users SET name = $1, email = $2 WHERE id = $3',
			[data.name, data.email, id],
		);
		return { id, ...data };
	}

	async delete(id: number) {
		await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
		return { deleted: true };
	}

	// Inseguro
	async rawQueryUnsafe(condition: string) {
		const sql = `SELECT * FROM users WHERE ${condition}`;
		console.log('sql =', sql);
		const result = await this.pool.query(sql);
		return result.rows;
	}

	// Seguro
	async rawQuerySafe(email: string) {
		const result = await this.pool.query(
			'SELECT * FROM users WHERE email = $1',
			[email],
		);
		return result.rows;
	}
	
}