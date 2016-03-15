import _ from 'lodash';

import xmanNgRedux from '../../xmanRedux';

import delay from './delay';
import appliedBy from './applied-by';
import speedMach from './speed-mach';
import cop from './cop';

import {
  getFlightById,
  isFlightHighlighted,
  isFlightTonedDown,
  getTotalDelay,
} from '../../selectors/flight';

import {
  setToneDownFilter,
  clearToneDownFilter
} from '../../actions/highlighter';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-row
 * @description
 * # XMAN : show a single flight row, receive flight as prop
 *
 */
export default angular.module('4me.ui.cwp.xman.components.flight-row', [
  xmanNgRedux,
  delay,
  appliedBy,
  speedMach,
  cop,
])
.component('fmeXmanFlightRow', {
  restrict: 'E',
  controller: xmanFlightRowController,
  bindings: {
    ifplId: '='
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/index.tpl.html'
})
.name;

xmanFlightRowController.$inject = ['$xmanNgRedux', '$scope'];
function xmanFlightRowController($xmanNgRedux, $scope) {

  const $ctrl = this;

  const mapStateToThis = (state) => {

    const ifplId = $ctrl.ifplId;

    const flight = getFlightById(state, ifplId);

    const isHighlighted = isFlightHighlighted(state, ifplId);
    const isTonedDown = isFlightTonedDown(state, ifplId);
    const totalDelay = getTotalDelay(state, ifplId);

    return {
      isHighlighted,
      isTonedDown,
      flight,
      totalDelay,
    };
  };

  const mapDispatchToThis = {
    clearToneDownFilter,
    toneDownFlightLevel: (flightLevel) => setToneDownFilter('position.vertical.currentFlightLevel', flightLevel),
    toneDownDestination: (destination) => setToneDownFilter('destination', destination)
  }

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis, mapDispatchToThis)(this);
  $scope.$on('$destroy', unsubscribe);


  $ctrl.getClasses = () => ({
    highlight: $ctrl.isHighlighted,
    'toned-down': $ctrl.isTonedDown
  });


}
