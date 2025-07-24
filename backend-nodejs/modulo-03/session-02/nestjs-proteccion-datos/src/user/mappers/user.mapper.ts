import { UserEntity } from '../entities/user.entity';
import { maskEmail } from 'src/common/utils/mask.util';

export function toPublic(user: UserEntity): Partial<UserEntity> {
  return {
    id: user.id,
    name: user.name,
    email: maskEmail(user.email),
  };
}

export function toAdmin(user: UserEntity): UserEntity {
  return user; // acceso completo
}