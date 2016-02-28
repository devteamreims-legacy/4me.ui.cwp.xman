import _ from 'lodash';
import xmanNgRedux from '../../xmanRedux';

import {
  togglePendingAction
} from '../../actions/highlighter';

import {
  getGeographicalFilter,
  getVerticalFilter,
  shouldShowFilters
} from '../../selectors/list-filter';

import {
  toggleGeographicalFilter,
  toggleVerticalFilter
} from '../../actions/list-filter';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.list-control
 * @description
 * # XMAN : control what's in the list
 *
 */
export default angular.module('4me.ui.cwp.xman.components.list-control', [xmanNgRedux])
.component('fmeXmanListControl', {
  restrict: 'E',
  controller: listControlController,
  templateUrl: 'views/cwp.xman/app/components/list-control/index.tpl.html'
})
.name;

listControlController.$inject = ['$xmanNgRedux', '$scope'];
function listControlController($xmanNgRedux, $scope) {

  const mapStateToThis = (state) => {

    const disableAll = state.flightList.isLoading;
    const showFilters = shouldShowFilters(state);
    const highlightPendingAction = state.highlighter.pendingAction;

    const verticalFilter = getVerticalFilter(state);
    const geographicalFilter = getGeographicalFilter(state);

    return {
      disableAll,
      showFilters,
      highlightPendingAction,
      verticalFilter,
      geographicalFilter
    };
  };

  const mapDispatchToThis = {
    togglePendingAction,
    toggleVerticalFilter,
    toggleGeographicalFilter
  };

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis, mapDispatchToThis)(this);
  $scope.$on('$destroy', unsubscribe);

  const $ctrl = this;


}