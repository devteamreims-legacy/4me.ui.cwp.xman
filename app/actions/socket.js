

export const XMAN_SOCKET_CONNECTED = 'XMAN_SOCKET_CONNECTED';
export const XMAN_SOCKET_DISCONNECTED = 'XMAN_SOCKET_DISCONNECTED';

export function socketConnected() {
  return (dispatch, getState) => {
    dispatch(socketConnectedAction());
  };
}

export function socketDisconnected() {
  return (dispatch, getState) => {
    dispatch(socketDisconnectAction());
  };
}

function socketDisconnectAction() {
  return {
    type: XMAN_SOCKET_DISCONNECTED
  };
}

function socketConnectedAction() {
  return {
    type: XMAN_SOCKET_CONNECTED
  };
}