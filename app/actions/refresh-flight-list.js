import _ from 'lodash';

export const XMAN_REFRESH_START = 'XMAN_REFRESH_START';
export const XMAN_REFRESH_COMPLETE = 'XMAN_REFRESH_COMPLETE';
export const XMAN_REFRESH_FAIL = 'XMAN_REFRESH_FAIL';

import api from '../api';
import axios from 'axios';

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

    axios.get(apiUrl)
      .then((response) => {
        console.log(response.data);
        dispatch(complete(response.data));
      })
      .catch((error) => {
        dispatch(fail(error.data));
      });
  }
}


export function fail(error = '') {
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