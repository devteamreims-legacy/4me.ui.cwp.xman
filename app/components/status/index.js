import _ from 'lodash';
import xmanNgRedux from '../../xmanRedux';


import {
  refreshFullList
} from '../../actions/flight-list';

import {
  getStatus
} from '../../selectors/status';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.status
 * @description
 * # XMAN : Small status component
 *
 */
export default angular.module('4me.ui.cwp.xman.components.status', [
  xmanNgRedux,
  'angularMoment'
])
.component('fmeXmanStatus', {
  restrict: 'E',
  controller: statusController,
  templateUrl: 'views/cwp.xman/app/components/status/index.tpl.html'
})
.name;

statusController.$inject = ['$xmanNgRedux', '$scope'];
function statusController($xmanNgRedux, $scope) {

  const mapStateToThis = (state) => {

    const {
      message,
      level,
      lastUpdated
    } = getStatus(state);

    return {
      message,
      lastUpdated,
      level
    };
  };

  const mapDispatchToThis = {
    refreshFullList
  };

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis, mapDispatchToThis)(this);
  $scope.$on('$destroy', unsubscribe);

}