import { combineReducers } from 'redux';
import flightListReducer from './flight-list';
import statusReducer from './status';
import highlighterReducer from './highlighter';
import whoAmIReducer from './who-am-i';


const rootReducer = combineReducers({
  flightList: flightListReducer,
  status: statusReducer,
  highlighter: highlighterReducer,
  whoAmI: whoAmIReducer
});

export default rootReducer;