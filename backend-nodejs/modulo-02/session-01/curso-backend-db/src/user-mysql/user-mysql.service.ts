import { Inject, Injectable } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class UserMysqlService {
	constructor(@Inject('MYSQL_POOL') private pool: Pool) {}

	async findAll() {
		const [rows] = await this.pool.query('SELECT * FROM users');
		return rows;
	}

	async findOne(id: number) {
		const [rows] = await this.pool.query('SELECT * FROM users WHERE id = ?', [id]);
		return Array.isArray(rows) ? rows[0] : null;
	}

	async create(data: { name: string; email: string }) {
		const [result] = await this.pool.query(
			'INSERT INTO users (name, email) VALUES (?, ?)',
			[data.name, data.email],
		);

		const insertResult = result as ResultSetHeader;

		return { id: insertResult.insertId, ...data };
	}

	async update(id: number, data: { name: string; email: string }) {
		await this.pool.query(
			'UPDATE users SET name = ?, email = ? WHERE id = ?',
			[data.name, data.email, id],
		);
		return { id, ...data };
	}

	async delete(id: number) {
		await this.pool.query('DELETE FROM users WHERE id = ?', [id]);
		return { deleted: true };
	}

	// Inseguro: construye la query como string
	async rawQueryUnsafe(condition: string) {
		const sql = `SELECT * FROM users WHERE ${condition}`;
		console.log('sql =', sql);
		const [rows] = await this.pool.query(sql);
		return rows;
	}

	// Seguro: usa parámetros
	async rawQuerySafe(email: string) {
		const [rows] = await this.pool.query(
			'SELECT * FROM users WHERE email = ?',
			[email],
		);
		return rows;
	}
}
