import _ from 'lodash';
import moment from 'moment';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-row.cop
 * @description
 * # XMAN : format cop
 *
 */
export default angular.module('4me.ui.cwp.xman.flight-row.cop', [])
.component('fmeXmanCop', {
  restrict: 'E',
  controller: copController,
  bindings: {
    copName: '<',
    targetTime: '<',
    estimatedTime: '<',
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/cop.tpl.html'
})
.name;

copController.$inject = [];
function copController() {
  const $ctrl = this;

  $ctrl.getTargetAtCop = () => {
    return moment.utc($ctrl.targetTime).format('HH:mm');
  }
}
