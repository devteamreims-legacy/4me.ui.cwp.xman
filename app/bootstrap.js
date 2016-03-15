import _ from 'lodash';

import {refreshFullList} from './actions/flight-list';

import {
  onSectorChange,
  onCwpChange
} from './actions/who-am-i';

import {setupSocketIo} from './socket/';
import api from './api';

import io from 'socket.io-client';

export function bootstrap(store, $rootScope, myCwp, mySector) {
  console.log('Bootstrapping XMAN organ ...');
  console.log('Connecting socket to ' + api.socket);
  const socketIo = io.connect(api.socket);

  console.log('Attaching handlers to socket');
  setupSocketIo(store.dispatch, socketIo);

  // Do not refresh xman list here, this will be handled when the 'bound sectors event' raises

  //console.log('Refreshing full flight list');
  //store.dispatch(refreshFullList());

  console.log('Attaching rootScope handlers');

  // This needs some serious refactor, in the core

  const handler = $rootScope.$on('fme:new-sectors', () => {
    console.log('DISPATCHING XMAN NEW SECTORS : ');
    store.dispatch(onSectorChange(_.get(mySector.get(), 'sectors', [])));
  });

  const handler2 = $rootScope.$on('fme:bound-cwp', () => {
    const cwp = {
      id: myCwp.get().id,
      name: myCwp.get().name
    };
    store.dispatch(onCwpChange(cwp));
  })
}
