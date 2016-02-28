import _ from 'lodash';

import {
  getMySectors
} from './who-am-i';

export function getVerticalFilter(state) {
  return state.flightList.verticalFilter;
}

export function getGeographicalFilter(state) {
  return state.flightList.geographicalFilter;
}

export const shouldShowFilters = (state) => !_.isEmpty(getMySectors(state));