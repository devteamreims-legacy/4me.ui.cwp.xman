import merge from 'lodash/merge';
import _ from 'lodash';

import {
  XMAN_REFRESH_START,
  XMAN_REFRESH_COMPLETE,
  XMAN_REFRESH_FAIL,
  XMAN_UPDATE_FLIGHT
} from '../actions/flight-list';

import {
  XMAN_SET_MACH,
  XMAN_SET_SPEED,
  XMAN_SET_MCS,
  XMAN_CLEAR_ACTION
} from '../actions/flight';

import {
  XMAN_SET_GEOGRAPHICAL_FILTER,
  XMAN_SET_VERTICAL_FILTER
} from '../actions/list-filter';

import {
  XMAN_SOCKET_DISCONNECTED
} from '../actions/socket';

import {
  getFlightById
} from '../selectors/flight';

import {
  getFlights
} from '../selectors/flight-list';

const defaultState = {
  isLoading: false,
  flights: [],
  error: null,
  geographicalFilter: true,
  verticalFilter: true
};

export default function flightListReducer(state = defaultState, action) {
  switch(action.type) {
    case XMAN_SET_MACH:
    case XMAN_SET_SPEED:
    case XMAN_SET_MCS:
    case XMAN_CLEAR_ACTION:
      return Object.assign({}, state, {
        flights: _.map(state.flights, flightByFlightReducer(action))
      })
    case XMAN_REFRESH_START:
      return Object.assign({}, state, {
        isLoading: true,
        flights: [],
        error: null
      });
    case XMAN_REFRESH_COMPLETE:
      return Object.assign({}, state, {
        isLoading: false,
        flights: action.flights,
        error: null
      });
    case XMAN_SOCKET_DISCONNECTED:
      return Object.assign({}, state, {
        isLoading: false,
        flights: [],
        error: 'Socket disconnected'
      });
    case XMAN_REFRESH_FAIL:
      return Object.assign({}, state, {
        isLoading: false,
        flights: [],
        error: action.error
      });
    case XMAN_SET_GEOGRAPHICAL_FILTER:
      return merge({}, state, {
        geographicalFilter: action.value
      });
    case XMAN_SET_VERTICAL_FILTER:
      return merge({}, state, {
        verticalFilter: action.value
      });
    case XMAN_UPDATE_FLIGHT:
      return Object.assign({}, state, {
        flights: updateFlights(state, action.flight)
      });
  }
  return state;
}

function updateFlights(state, flight) {

  const updatedFlightId = _.get(flight, 'ifplId', null);


  const oldFlightIndex = _.findIndex(state.flights, f => f.ifplId === updatedFlightId);
  const oldFlight = state.flights[oldFlightIndex];


  console.log('Updating flight, index is : ' + oldFlightIndex);
  console.log(oldFlight);

  return [
    ...state.flights.slice(0, oldFlightIndex),
    flight,
    ...state.flights.slice(oldFlightIndex + 1)
  ];
}

function flightsWithout(flights, ifplIds = []) {
  return _.reject(flights, f => _.includes(ifplIds, f.ifplId));
}

function flightByFlightReducer(action) {
  return (flight) => {
    if(!action.ifplId || flight.ifplId !== action.ifplId) {
      return flight;
    }
    switch(action.type) {
      case XMAN_SET_MACH:
        return merge({}, flight, {
          currentStatus: {
            machReduction: action.machReduction,
            when: Date.now(),
            who: action.who
          }
        });
      case XMAN_SET_MCS:
        return merge({}, flight, {
          currentStatus: {
            minimumCleanSpeed: action.minimumCleanSpeed,
            when: Date.now(),
            who: action.who
          }
        });
      case XMAN_SET_SPEED:
        return merge({}, flight, {
          currentStatus: {
            speed: action.speed,
            when: Date.now(),
            who: action.who
          }
        });
      case XMAN_CLEAR_ACTION:
        return Object.assign({}, flight, {
          currentStatus: {
            minimumCleanSpeed: false,
            machReduction: null,
            speed: null,
            when: Date.now(),
            who: action.who
          }
        });
    }
    return flight;
  };
}
