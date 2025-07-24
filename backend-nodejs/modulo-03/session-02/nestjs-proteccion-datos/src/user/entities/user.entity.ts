export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  ssn: string;
}