
import {
  getVerticalFilter,
  getGeographicalFilter
} from './list-filter';

import {
  getMySectors
} from './who-am-i';

export const getQueryParams = (state) => {
  const sectors = getGeographicalFilter(state) ? getMySectors(state) : [];
  const verticalFilter = _.isEmpty(sectors) ? false : getVerticalFilter(state);

  if(verticalFilter) {
    return {sectors, verticalFilter};
  }

  return {sectors};
};