import _ from 'lodash';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.socket
 * @description
 * # Socket module
 *
 * Meta module to include socket.io communication
 */
angular.module('4me.ui.cwp.xman.socket', [
  '4me.ui.cwp.xman.status',
  'btford.socket-io'
])
.factory('xmanSocket', xmanSocket);

xmanSocket.$inject = ['socketFactory', 'cwp.xman.api', 'cwp.xman.status', '$timeout'];
function xmanSocket(socketFactory, api, status, $timeout) {
  let reconnectTimeout = 5000;
  const maxReconnectTimeout = 300000;
  let connected = false;
  let connectedPromise;

  const myIoSocket = io.connect(api.socket, {
    reconnection: true,
    reconnectionDelay: 10000,
    timeout: 5000
  });

  const mySocket = socketFactory({ioSocket: myIoSocket});

  mySocket.on('disconnect', function(err) {
    console.log(err);
    status.escalate('socket', 'critical', 'Disconnected from xman backend, retrying in ' + reconnectTimeout/1000 + 's');
    if(connectedPromise !== undefined) {
      $timeout.cancel(connectedPromise);
    } 
    $timeout(function() {
      reconnectTimeout = reconnectTimeout * 2;
      if(reconnectTimeout > maxReconnectTimeout) {
        reconnectTimeout = maxReconnectTimeout;
      }
      myIoSocket.connect();
    }, reconnectTimeout);
    return true;
  });

  mySocket.on('connect', function() {
    console.log('connecting ...');
    // Wait 1 second before claiming victory
    connectedPromise = $timeout(function() {
      console.log('xmanWebSocket: Connected !');
      // Recover status
      status.recover('socket');
      // Set flag to 'connected'
      connected = true;
      // Reset $timeout promise
      connectedPromise = undefined;
      // Reset reconnectTimeout
      reconnectTimeout = 5000;

      mySocket.emit('set_sector_filter', ['UR', 'XR']);
      
    }, 1000);
    return true;
  });

  mySocket.on('connection', function() {
    //status.recover('socket');
    console.log('Socket to mapping backend connected !');
    return true;
  });

  mySocket.on('connect_error', function(err) {
    if(_.isEmpty(status.getReasons('socket'))) {
      status.escalate('socket', 'critical', 'Could not connect to mapping backend');
    }
    return true;
  });

  return mySocket;
}