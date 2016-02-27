import { combineReducers } from 'redux';
import flightListReducer from './flight-list';
import statusReducer from './status';
import highlighterReducer from './highlighter';


const rootReducer = combineReducers({
  flightList: flightListReducer,
  status: statusReducer,
  highlighter: highlighterReducer
});

export default rootReducer;