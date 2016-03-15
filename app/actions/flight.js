import _ from 'lodash';

export const XMAN_SET_MACH = 'XMAN_SET_MACH';
export const XMAN_SET_SPEED = 'XMAN_SET_SPEED';
export const XMAN_SET_MCS = 'XMAN_SET_MCS';

export const XMAN_CLEAR_ACTION = 'XMAN_CLEAR_ACTION';

import {
  sendXmanAction
} from '../socket';


function setMachAction(ifplId, machReduction, who = {}) {
  return {
    type: XMAN_SET_MACH,
    ifplId,
    machReduction,
    who
  };
}

function setSpeedAction(ifplId, speed, who = {}) {
  return {
    type: XMAN_SET_SPEED,
    ifplId,
    speed,
    who
  };
}

function setMcsAction(ifplId, minimumCleanSpeed, who = {}) {
  return {
    type: XMAN_SET_MCS,
    ifplId,
    minimumCleanSpeed,
    who
  };
}

function clearActionAction(ifplId, who = {}) {
  return {
    type: XMAN_CLEAR_ACTION,
    ifplId,
    who
  };
}

export function setMach(ifplId, machReduction, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.ifplId === ifplId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setMach : unknown flight with id ${ifplId}`);
      return;
    }



    // Dispatch action
    dispatch(setMachAction(ifplId, machReduction, who));


    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        machReduction
      }
    };

    // Emit action via socket
    sendXmanAction(ifplId, status);
  }
}

export function setSpeed(ifplId, speed, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.ifplId === ifplId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setSpeed : unknown flight with id ${ifplId}`);
      return;
    }

    // Dispatch action
    dispatch(setSpeedAction(ifplId, speed, who));

    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        speed
      }
    };

    // Emit action via socket
    sendXmanAction(ifplId, status);
  }
}

export function setMcs(ifplId, mcs, who) {
  return (dispatch, getState) => {
    const flight = _.find(getState().flightList.flights, f => f.ifplId === ifplId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : setMcs : unknown flight with id ${ifplId}`);
      return;
    }


    // Dispatch action
    dispatch(setMcsAction(ifplId, mcs, who));

    // Build 'status' object
    const status = {
      who,
      xmanAction: {
        minimumCleanSpeed: mcs
      }
    };

    // Emit action via socket
    sendXmanAction(ifplId, status);

  }
}

export function clearAction(ifplId, who) {
  return (dispatch, getState) => {
    // Check if flight exists
    const flight = _.find(getState().flightList.flights, f => f.ifplId === ifplId);

    if(_.isEmpty(flight)) {
      console.log(`XMAN Actions : clearAction : unknown flight with id ${ifplId}`);
      return;
    }


    // Dispatch action
    dispatch(clearActionAction(ifplId, who));

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
    sendXmanAction(ifplId, status);
  }
}
