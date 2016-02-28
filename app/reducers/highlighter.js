import _ from 'lodash';
import merge from 'lodash/merge';

import {
  XMAN_HIGHLIGHTER_TOGGLE_PENDING_ACTION,
  XMAN_HIGHLIGHTER_SET_TONE_DOWN,
  XMAN_HIGHLIGHTER_CLEAR_TONE_DOWN
} from '../actions/highlighter';

const defaultState = {
  pendingAction: true,
  toneDown: {}
};

export default function(state = defaultState, action) {
  switch(action.type) {
    case XMAN_HIGHLIGHTER_TOGGLE_PENDING_ACTION:
      return merge({}, state, {
        pendingAction: !state.pendingAction
      });
    case XMAN_HIGHLIGHTER_SET_TONE_DOWN:
      return merge({}, state, {
        toneDown: {
          path: action.path,
          value: action.value
        }
      });
    case XMAN_HIGHLIGHTER_CLEAR_TONE_DOWN:
      return Object.assign({}, state, {
        toneDown: undefined
      });
  }
  return state;
}