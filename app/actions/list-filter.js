

export const XMAN_SET_GEOGRAPHICAL_FILTER = 'XMAN_SET_GEOGRAPHICAL_FILTER';
export const XMAN_SET_VERTICAL_FILTER = 'XMAN_SET_VERTICAL_FILTER';


import {
  getVerticalFilter,
  getGeographicalFilter
} from '../selectors/list-filter';

import {
  refreshFullList
} from './flight-list';

export function toggleVerticalFilter(value) {
  return (dispatch, getState) => {
    // Prevent activating verticalFilter if geographicalFilter is disabled
    const geographicalFilter = getGeographicalFilter(getState());

    if(!geographicalFilter) {
      return;
    }

    const verticalFilter = getVerticalFilter(getState());

    if(value === undefined) {
      value = !verticalFilter;
    }

    // Inform backend of our change of subscription here
    dispatch(setVerticalFilterAction(value));

    // Send socket change

    // Refresh full list
    dispatch(refreshFullList());

  };
}

export function toggleGeographicalFilter(value) {
  return (dispatch, getState) => {
    const geographicalFilter = getGeographicalFilter(getState());

    if(value === undefined) {
      value = !geographicalFilter;
    }

    dispatch(setGeographicalFilterAction(value));
    // Bind our verticalFilter state to geographicalFilter;
    
    dispatch(setVerticalFilterAction(value));
    dispatch(refreshFullList());
  }
}

function setVerticalFilterAction(value) {
  return {
    type: XMAN_SET_VERTICAL_FILTER,
    value
  };
}

function setGeographicalFilterAction(value) {
  return {
    type: XMAN_SET_GEOGRAPHICAL_FILTER,
    value
  };
}