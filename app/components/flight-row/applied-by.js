import _ from 'lodash';
import {refreshFullList} from '../../actions/refresh-flight-list';
import xmanNgRedux from '../../xmanRedux';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-row.applied-by
 * @description
 * # XMAN : show applied by
 *
 */
export default angular.module('4me.ui.cwp.xman.flight-row.applied-by', [xmanNgRedux])
.component('fmeXmanAppliedBy', {
  restrict: 'E',
  controller: appliedByController,
  bindings: {
    cwp: '<', // Unused for now
    sectors: '<',
    when: '<'
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/applied-by.tpl.html'
})
.name;

appliedByController.$inject = [];
function appliedByController() {

}