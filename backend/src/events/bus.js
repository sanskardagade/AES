import { EventEmitter } from 'events';

const emitter = new EventEmitter();
emitter.setMaxListeners(50);

export function emit(eventName, payload) {
  emitter.emit(eventName, payload);
}

export function on(eventName, listener) {
  emitter.on(eventName, listener);
  return () => emitter.off(eventName, listener);
}

export default { emit, on };


 