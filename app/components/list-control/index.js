import _ from 'lodash';
import xmanNgRedux from '../../xmanRedux';

import {
  togglePendingAction
} from '../../actions/highlighter';

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
  controller: listController,
  templateUrl: 'views/cwp.xman/app/components/list-control/index.tpl.html'
})
.name;

listController.$inject = ['$xmanNgRedux', '$scope'];
function listController($xmanNgRedux, $scope) {

  const mapStateToThis = (state) => {

    const disableAll = state.flightList.isLoading;
    const highlightPendingAction = state.highlighter.pendingAction;

    return {
      disableAll,
      highlightPendingAction
    };
  };

  const mapDispatchToThis = {
    togglePendingAction
  };

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis, mapDispatchToThis)(this);
  $scope.$on('$destroy', unsubscribe);

  const $ctrl = this;
  
  console.log($ctrl.togglePendingAction);


}