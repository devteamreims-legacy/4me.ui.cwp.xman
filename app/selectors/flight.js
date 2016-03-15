import _ from 'lodash';
import { createSelector } from 'reselect';


const flights = state => state.flightList.flights;

const advisedSpeed = (state, ifplId) => _.get(getFlightById(state, ifplId), 'advisory.speed', null);
const advisedMach = (state, ifplId) => _.get(getFlightById(state, ifplId), 'advisory.machReduction', null);

const appliedSpeed = (state, ifplId) => _.get(getFlightById(state, ifplId), 'currentStatus.speed', null);
const appliedMach = (state, ifplId) => _.get(getFlightById(state, ifplId), 'currentStatus.machReduction', null);

const minimumCleanSpeed = (state, ifplId) => _.get(getFlightById(state, ifplId), 'currentStatus.minimumCleanSpeed', false);

export function getFlightById(state, ifplId) {
  return _.find(flights(state), f => f.ifplId === ifplId);
}

export const getTotalDelay = (state, ifplId) => {
  return Math.floor(_.get(getFlightById(state, ifplId), 'delay', 0) / 60);
};


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

export function isFlightHighlighted(state, ifplId) {
  const flight = getFlightById(state, ifplId);

  if(_.isEmpty(flight)) {
    return false;
  }

  const mcs = minimumCleanSpeed(state, ifplId);

  // Establish mode
  let advised;
  let applied;

  if(advisedSpeed(state, ifplId) !== null) {
    // Assume speed mode
    advised = advisedSpeed(state, ifplId);
    applied = appliedSpeed(state, ifplId);
  } else {
    advised = -advisedMach(state, ifplId);
    applied = -appliedMach(state, ifplId);
  }

  return state.highlighter.pendingAction && !isActionComplete(advised, applied, mcs);
}

export function isFlightTonedDown(state, ifplId) {
  const flight = getFlightById(state, ifplId);

  const filter = state.highlighter.toneDown;

  if(_.isEmpty(flight) || _.isEmpty(filter)) {
    return false;
  }

  const {path, value} = filter;

  return !_.matchesProperty(path, value)(flight);

}

