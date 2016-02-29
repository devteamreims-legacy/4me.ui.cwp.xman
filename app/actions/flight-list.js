import _ from 'lodash';

export const XMAN_REFRESH_START = 'XMAN_REFRESH_START';
export const XMAN_REFRESH_COMPLETE = 'XMAN_REFRESH_COMPLETE';
export const XMAN_REFRESH_FAIL = 'XMAN_REFRESH_FAIL';

export const XMAN_ADD_FLIGHTS = 'XMAN_ADD_FLIGHTS';
export const XMAN_UPDATE_FLIGHTS = 'XMAN_UPDATE_FLIGHTS';
export const XMAN_REMOVE_FLIGHTS = 'XMAN_REMOVE_FLIGHTS';

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

export function addFlightsAction(flights = []) {
  return {
    type: XMAN_ADD_FLIGHTS,
    flights
  };
}

export function updateFlightsAction(flights = []) {
  return {
    type: XMAN_UPDATE_FLIGHTS,
    flights
  };
}

export function removeFlightsAction(flightIds = []) {
  return {
    type: XMAN_REMOVE_FLIGHTS,
    flightIds
  };
}

import {
  getKnownFlightIds
} from '../selectors/flight-list';

export function removeFlights(flightIds = []) {
  return (dispatch, getState) => {
    if(_.isEmpty(flightIds)) {
      console.log('Trying to remove no flights');
      return;
    }
    const untrackedFlightIds = _.without(flightIds, ...getKnownFlightIds(getState()));
    
    if(!_.isEmpty(untrackedFlightIds)) {
      console.log('Trying to remove unknown flights : ');
      console.log(untrackedFlightIds);
    }

    const flightIdsToRemove = _.without(flightIds, ...untrackedFlightIds);

    if(_.isEmpty(flightIdsToRemove)) {
      console.log('Nothing left to remove after filtering unknown flights');
      return;
    }

    return dispatch(removeFlightsAction(flightIdsToRemove));

  }
}

export function addFlights(flights = []) {
  return (dispatch, getState) => {
    if(_.isEmpty(flights)) {
      console.log('Trying to add no flights');
      return;
    }

    const knownFlightIds = getKnownFlightIds(getState());

    const isAlreadyKnown = (flight) => _.includes(knownFlightIds, flight.flightId);

    const actualFlightsToAdd = _(flights)
      .reject(isAlreadyKnown)
      .value();

    const leftovers = _(flights)
      .filter(isAlreadyKnown)
      .value();

    console.log('XMAN addFlights : ');
    console.log(actualFlightsToAdd);

    if(!_.isEmpty(leftovers)) {
      console.log('Some flights were already known');
      console.log(leftovers);
    }

    if(!_.isEmpty(actualFlightsToAdd)) {
      console.log('Trying to add actual flights !');
      return dispatch(addFlightsAction(actualFlightsToAdd));
    }
  };
}

export function updateFlights(flights = []) {
  return (dispatch, getState) => {
    if(_.isEmpty(flights)) {
      console.log('Trying to update no flights');
      return;
    }

    const knownFlightIds = getKnownFlightIds(getState());

    const isAlreadyKnown = (flight) => _.includes(knownFlightIds, flight.flightId);

    const actualFlightsToUpdate = _(flights)
      .filter(isAlreadyKnown)
      .value();

    const leftovers = _(flights)
      .reject(isAlreadyKnown)
      .value();

    console.log('XMAN updateFlights : ');
    console.log(actualFlightsToUpdate);

    if(!_.isEmpty(leftovers)) {
      console.log('Some flights were unknown');
      console.log(leftovers);
    }

    if(!_.isEmpty(actualFlightsToUpdate)) {
      console.log('Trying to update actual flights !');
      return dispatch(updateFlightsAction(actualFlightsToUpdate));
    }
  };
}