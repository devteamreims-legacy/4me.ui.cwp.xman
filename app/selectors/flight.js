import _ from 'lodash';
import { createSelector } from 'reselect';


const flights = state => state.flightList.flights;

const advisedSpeed = (state, flightId) => _.get(getFlightById(state, flightId), 'advisory.speed', null);
const advisedMach = (state, flightId) => _.get(getFlightById(state, flightId), 'advisory.machReduction', null);

const appliedSpeed = (state, flightId) => _.get(getFlightById(state, flightId), 'currentStatus.speed', null);
const appliedMach = (state, flightId) => _.get(getFlightById(state, flightId), 'currentStatus.machReduction', null);

const minimumCleanSpeed = (state, flightId) => _.get(getFlightById(state, flightId), 'currentStatus.minimumCleanSpeed', false);

export function getFlightById(state, flightId) {
  return _.find(flights(state), f => f.flightId === flightId);
}


export function isActionComplete(advisedSpeed, appliedSpeed, minimumCleanSpeed) {
  if(!advisedSpeed || advisedSpeed === 0) {
    return true;
  }

  if(minimumCleanSpeed === true) {
    return true;
  }

  if(!appliedSpeed) {
    return false;
  }

  if(advisedSpeed >= appliedSpeed) {
    return true;
  }

  return false;
}

export function isFlightHighlighted(state, flightId) {
  const flight = getFlightById(state, flightId);
  
  if(_.isEmpty(flight)) {
    return false;
  }

  const mcs = minimumCleanSpeed(state, flightId);

  // Establish mode
  let advised;
  let applied;

  if(advisedSpeed(state, flightId) !== null) {
    // Assume speed mode
    advised = advisedSpeed(state, flightId);
    applied = appliedSpeed(state, flightId);
  } else {
    advised = -advisedMach(state, flightId);
    applied = -appliedMach(state, flightId);
  }

  return state.highlighter.pendingAction && !isActionComplete(advised, applied, mcs);
}

export function isFlightTonedDown(state, flightId) {
  const flight = getFlightById(state, flightId);

  const filter = state.highlighter.toneDown;

  if(_.isEmpty(flight) || _.isEmpty(filter)) {
    return false;
  }

  const {path, value} = filter;

  return !_.matchesProperty(path, value)(flight);

}

