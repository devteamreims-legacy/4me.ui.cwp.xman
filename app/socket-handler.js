import _ from 'lodash';

export function bindXmanEventsToSocket(xmanSocket, xmanFlights) {
  if(typeof xmanSocket.on !== 'function') {
    return;
  }

  xmanSocket.on('add_flights', (data) => {
    if(xmanFlights.isLoading()) {
      console.log('Got socket data while loading data, discard socket data');
      return;
    }
    console.log('ADD_FLIGHTS : Got flights from backend');

  });


  xmanSocket.on('update_status', (data) => {
    if(xmanFlights.isLoading()) {
      console.log('Got socket data while loading data, discard socket data');
      return;
    }

    if(data.flightId === undefined) {
      console.log('Got empty data from socket');
      return;
    }
    
    xmanFlights.getAll()
      .then((flights) => _.find(flights, f => f.flightId === data.flightId))
      .then(flight => {
        if(_.isEmpty(flight)) {
          console.log(`Flight with id ${data.flightId} is not tracked, dismissing ...`);
          return Promise.reject('Unknown flightId');
        }
        flight.setCurrentStatus(_.omit(data, 'flightId'));
      })

  });

}