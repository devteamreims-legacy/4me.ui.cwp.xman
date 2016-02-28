import _ from 'lodash';

export const XMAN_REFRESH_START = 'XMAN_REFRESH_START';
export const XMAN_REFRESH_COMPLETE = 'XMAN_REFRESH_COMPLETE';
export const XMAN_REFRESH_FAIL = 'XMAN_REFRESH_FAIL';

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

    if(isLoading) {
      console.log('Already loading !!');
      return;
    }

    dispatch(start());

    const apiUrl = api.rootPath + api.xman.getAll;

    const queryParams = getQueryParams(getState());

    console.log('Loading XMAN flights with these params :');
    console.log(queryParams);
    
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