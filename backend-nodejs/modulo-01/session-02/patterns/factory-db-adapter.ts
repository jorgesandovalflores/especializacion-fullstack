import { createMySQLConnection } from './mysql';
import { createPostgresConnection } from './postgres';

export function createDBAdapter(type: 'mysql' | 'postgres') {
  if (type === 'mysql') return createMySQLConnection();
  if (type === 'postgres') return createPostgresConnection();
}