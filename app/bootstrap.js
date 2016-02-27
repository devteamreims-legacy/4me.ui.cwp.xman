import {refreshFullList} from './actions/refresh-flight-list';
import {setupSocketIo} from './socket/';
import api from './api';

import io from 'socket.io-client';

export function bootstrap(store) {
  console.log('Bootstrapping XMAN organ');
  store.dispatch(refreshFullList());

  console.log('XMAN : Initialize socket');
  console.log('Connecting socket to ' + api.socket);

  const socketIo = io.connect(api.socket);

  setupSocketIo(store.dispatch, socketIo);
}