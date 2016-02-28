import _ from 'lodash';
import {refreshFullList} from '../../actions/flight-list';
import xmanNgRedux from '../../xmanRedux';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-list
 * @description
 * # XMAN : show the whole flight list
 *
 */
export default angular.module('4me.ui.cwp.xman.components.flight-list', [xmanNgRedux])
.component('fmeXmanFlightList', {
  restrict: 'E',
  controller: flightListController,
  templateUrl: 'views/cwp.xman/app/components/flight-list/index.tpl.html'
})
.name;

flightListController.$inject = ['$xmanNgRedux', '$scope'];
function flightListController($xmanNgRedux, $scope) {

  const mapStateToThis = (state) => ({
      isLoading: state.flightList.isLoading,
      flights: state.flightList.flights,
      status: state.status,
  });

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis)(this);
  $scope.$on('$destroy', unsubscribe);

}