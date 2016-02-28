import {
  socketConnected,
  socketDisconnected
} from '../actions/socket';

let mySocket;

// Global socketIo object event handler
export function setupSocketIo(dispatch, socketIo) {
  console.log('Initializing socket.io');

  mySocket = socketIo;

  socketIo.on('connect', function(socket) {
    console.log('Connected to server !');
    dispatch(socketConnected());
  });

  socketIo.on('disconnect', (socket) => dispatch(socketDisconnected()));

  attachHandlerToSocket(dispatch, socketIo);

  return mySocket;
}


export function getSocket() {
  return mySocket;
}

export function setSubscriptionFilter(data) {
  let {sectors = [], verticalFilter = true} = data;

  const socket = getSocket();

  if(!socket || !socket.emit) {
    console.error('xmanSocket: setSubscriptionFilter: Socket is undefined !!');
    return;
  }

  if(_.isEmpty(sectors)) {
    verticalFilter = false;
  }

  if(socket && socket.emit) {
    console.log('Changing socket subscription !');
    console.log({sectors, verticalFilter});
    socket.emit('set_subscription_filter', {sectors, verticalFilter});
  }
}

export function attachHandlerToSocket(dispatch, socket) {
  socket.on('add_flights', (data) => {
    console.log('ADD_FLIGHTS');
    console.log(data);
  });

  socket.on('remove_flights', (data) => {
    console.log('REMOVE_FLIGHTS');
    console.log(data);
  });

  socket.on('update_flights', (data) => {
    console.log('UPDATE_FLIGHTS');
    console.log(data);
  });

}