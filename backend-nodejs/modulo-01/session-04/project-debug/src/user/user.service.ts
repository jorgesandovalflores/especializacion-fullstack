import { Injectable } from '@nestjs/common';
import { logger } from '../logger';
import { userEvents } from './user.emitter';
const debug = require('debug')('app:user');

@Injectable()
export class UserService {

  findUserById(id: number) {
    debug(`Buscando usuario con ID: ${id}`);
    logger.info(`findUserById ejecutado con ID ${id}`);

    if (id === 1) {
      const user = { id, name: 'Jorge' };
      userEvents.emit('userFound', user); // Evento personalizado
      return user;
    }

    userEvents.emit('error', new Error(`Usuario con ID ${id} no encontrado`));
    throw new Error('Usuario no encontrado');
  }
  
}