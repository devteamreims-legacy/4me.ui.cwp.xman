import merge from 'lodash/merge';
import _ from 'lodash';

import {
  XMAN_REFRESH_START,
  XMAN_REFRESH_COMPLETE,
  XMAN_REFRESH_FAIL,
  XMAN_ADD_FLIGHTS,
  XMAN_UPDATE_FLIGHTS,
  XMAN_REMOVE_FLIGHTS
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
    case XMAN_REMOVE_FLIGHTS:
      return Object.assign({}, state, {
        flights: flightsWithout(state.flights, action.flightIds)
      });
    case XMAN_ADD_FLIGHTS:
      return Object.assign({}, state, {
        flights: [
          ...state.flights,
          ...action.flights
        ]
      });
    case XMAN_UPDATE_FLIGHTS:
      return Object.assign({}, state, {
        flights: updateFlights(state.flights, action.flights)
      });
  }
  return state;
}

function updateFlights(oldFlights, newData) {

  const mergeNewData = (oldFlight) => {

    const flightId = oldFlight.flightId;
    const newFlight = _.find(newData, f => f.flightId === flightId);

    if(_.isEmpty(newData)) {
      return oldFlights;
    }

    return Object.assign({}, oldFlight, newFlight);
  }

  return _.map(oldFlights, mergeNewData);
}

function flightsWithout(flights, flightIds = []) {
  return _.reject(flights, f => _.includes(flightIds, f.flightId));
}

function flightByFlightReducer(action) {
  return (flight) => {
    if(!action.flightId || flight.flightId !== action.flightId) {
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