import { UserRole } from '../interfaces/user.interface';

declare global {
	namespace Express {
		interface User {
			id: number;
			role: UserRole;
			permissions: string[];
		}

		interface Request {
			user: User;
		}
	}
}
