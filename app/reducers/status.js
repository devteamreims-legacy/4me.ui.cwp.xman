import _ from 'lodash';

import {
  XMAN_REFRESH_COMPLETE,
  XMAN_REFRESH_FAIL
} from '../actions/flight-list';

import {
  XMAN_SOCKET_CONNECTED,
  XMAN_SOCKET_DISCONNECTED
} from '../actions/socket';

const defaultState = {
  level: 'normal',
  lastUpdated: Date.now(),
  message: ''
};

export default function statusReducer(state = defaultState, action) {
  switch(action.type) {
    case XMAN_SOCKET_CONNECTED:
    case XMAN_REFRESH_COMPLETE:
      return Object.assign({}, state, {
        level: 'normal',
        lastUpdated: Date.now(),
        message: ''
      });
    case XMAN_REFRESH_FAIL:
      return Object.assign({}, state, {
        level: 'critical',
        lastUpdated: Date.now(),
        message: `Refresh from backend failed : ${action.error}`
      });
    case XMAN_SOCKET_DISCONNECTED:
      return Object.assign({}, state, {
        level: 'critical',
        lastUpdated: Date.now(),
        message: 'Lost socket connection to backend'
      });
  }
  return state;
}