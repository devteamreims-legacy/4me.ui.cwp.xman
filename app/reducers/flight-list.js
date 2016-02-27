import merge from 'lodash/merge';
import _ from 'lodash';

import {
  XMAN_REFRESH_START,
  XMAN_REFRESH_COMPLETE,
  XMAN_REFRESH_FAIL
} from '../actions/refresh-flight-list';

import {
  XMAN_SET_MACH,
  XMAN_SET_SPEED,
  XMAN_SET_MCS,
  XMAN_CLEAR_ACTION
} from '../actions/flight';

const defaultState = {
  isLoading: false,
  flights: [],
  error: null
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
    case XMAN_REFRESH_FAIL:
      return Object.assign({}, state, {
        isLoading: false,
        flights: [],
        error: action.error
      });
  }
  return state;
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