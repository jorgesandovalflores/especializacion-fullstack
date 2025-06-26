// Ejemplo de EventEmitter para manejar eventos personalizados

import { EventEmitter } from 'events';

export const userEvents = new EventEmitter();

// Evento cuando se encuentra un usuario
userEvents.on('userFound', (data) => {
  console.log('Usuario encontrado:', data);
});

// Evento cuando ocurre un error
userEvents.on('error', (err) => {
  console.error('Error capturado por el EventEmitter:', err.message);
});