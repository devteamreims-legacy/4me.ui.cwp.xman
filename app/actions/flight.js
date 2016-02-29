import _ from 'lodash';

export const XMAN_SET_MACH = 'XMAN_SET_MACH';
export const XMAN_SET_SPEED = 'XMAN_SET_SPEED';
export const XMAN_SET_MCS = 'XMAN_SET_MCS';

export const XMAN_CLEAR_ACTION = 'XMAN_CLEAR_ACTION';

import {
  sendXmanAction
} from '../socket';


function setMachAction(flightId, machReduction, who = {}) {
  return {
    type: XMAN_SET_MACH,
    flightId,
    machReduction,
    who
  };
}

function setSpeedAction(flightId, speed, who = {}) {
  return {
    type: XMAN_SET_SPEED,
    flightId,
    speed,
    who
  };
}

function setMcsAction(flightId, minimumCleanSpeed, who = {}) {
  return {
    type: XMAN_SET_MCS,
    flightId,
    minimumCleanSpeed,
    who
  };
}

function clearActionAction(flightId, who = {}) {
  return {
    type: XMAN_CLEAR_ACTION,
    flightId,
    who
  };
}

export function setMach(flightId, machReduction, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.flightId === flightId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setMach : unknown flight with id ${flightId}`);
      return;
    }

    

    // Dispatch action
    dispatch(setMachAction(flightId, machReduction, who));


    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        machReduction
      }
    };

    // Emit action via socket
    sendXmanAction(flightId, status);
  }
}

export function setSpeed(flightId, speed, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.flightId === flightId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setSpeed : unknown flight with id ${flightId}`);
      return;
    }

    // Dispatch action
    dispatch(setSpeedAction(flightId, speed, who));

    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        speed
      }
    };

    // Emit action via socket
    sendXmanAction(flightId, status);
  }
}

export function setMcs(flightId, mcs, who) {
  return (dispatch, getState) => {
    const flight = _.find(getState().flightList.flights, f => f.flightId === flightId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setMcs : unknown flight with id ${flightId}`);
      return;
    }


    // Dispatch action
    dispatch(setMcsAction(flightId, mcs, who));

    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        minimumCleanSpeed: mcs
      }
    };

    // Emit action via socket
    sendXmanAction(flightId, status);

  }
}

export function clearAction(flightId, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.flightId === flightId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : clearAction : unknown flight with id ${flightId}`);
      return;
    }


    // Dispatch action
    dispatch(clearActionAction(flightId, who));

    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        machReduction: null,
        speed: null,
        minimumCleanSpeed: null
      }
    };

    // Emit action via socket
    sendXmanAction(flightId, status);
  }
}