import _ from 'lodash';

export const XMAN_REFRESH_START = 'XMAN_REFRESH_START';
export const XMAN_REFRESH_COMPLETE = 'XMAN_REFRESH_COMPLETE';
export const XMAN_REFRESH_FAIL = 'XMAN_REFRESH_FAIL';

export const XMAN_UPDATE_FLIGHT = 'XMAN_UPDATE_FLIGHT';

import api from '../api';
import axios from 'axios';

import {
  setSubscriptionFilter
} from '../socket';

import {
  getVerticalFilter,
  getGeographicalFilter
} from '../selectors/list-filter';

import {
  getQueryParams
} from '../selectors/flight-list';

// Refresh the full xman flight list
// Uses redux thunk
export function refreshFullList() {
  return (dispatch, getState) => {
    // Check if loading
    let isLoading = getState().flightList.isLoading;

    // Here we should abort current request and restart one
    // This is not currently implemented in axios
    // See here : https://github.com/mzabriskie/axios/issues/50

    // Current workaround is to let first request fly and to just resend one
    /*
    if(isLoading) {
      console.log('Already loading !!');
      return;
    }
    */

    dispatch(start());

    const apiUrl = api.rootPath + api.xman.getAll;

    const queryParams = getQueryParams(getState());

    console.log('Loading XMAN flights with these params :');
    console.log(queryParams);

    // Update socket subscription
    setSubscriptionFilter(queryParams);

    return axios.get(apiUrl, {
      params: queryParams
    }).then((response) => {
        return dispatch(complete(response.data));
      })
      .catch((error) => {
        return dispatch(fail(error));
      });
  }
}


export function fail(rawError) {
  const error = rawError.message || rawError.statusText || 'Unknown error';
  return {
    type: XMAN_REFRESH_FAIL,
    error
  };
}

export function start() {
  return {
    type: XMAN_REFRESH_START
  };
}


export function complete(flights = []) {
  return {
    type: XMAN_REFRESH_COMPLETE,
    flights
  };
}


export function updateFlightAction(flight = {}) {
  return {
    type: XMAN_UPDATE_FLIGHT,
    flight
  };
}

import {
  getKnownFlightIds
} from '../selectors/flight-list';

export function updateFlight(flight) {
  return (dispatch, getState) => {
    if(_.isEmpty(flight)) {
      console.log('XMAN : updateFlight : Empty data provided !');
      return;
    }

    const knownFlightIds = getKnownFlightIds(getState());
    const updatedFlightId = _.get(flight, 'ifplId', null);

    const isKnown = _.includes(knownFlightIds, updatedFlightId);

    if(!isKnown) {
      console.log(`XMAN : updateFlight : Unknown flight id : ${updatedFlightId}`);
      return;
    }


    return dispatch(updateFlightAction(flight));
  };
}
