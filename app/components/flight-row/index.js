import _ from 'lodash';

import xmanNgRedux from '../../xmanRedux';

import delay from './delay';
import appliedBy from './applied-by';
import speedMach from './speed-mach';

import {
  getFlightById,
  isFlightHighlighted,
  isFlightTonedDown
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
  speedMach
])
.component('fmeXmanFlightRow', {
  restrict: 'E',
  controller: xmanFlightRowController,
  bindings: {
    flightId: '='
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/index.tpl.html'
})
.name;

xmanFlightRowController.$inject = ['$xmanNgRedux', '$scope'];
function xmanFlightRowController($xmanNgRedux, $scope) {

  const $ctrl = this;

  const mapStateToThis = (state) => {

    const flightId = $ctrl.flightId;

    const flight = getFlightById(state, flightId);

    const isHighlighted = isFlightHighlighted(state, flightId);
    const isTonedDown = isFlightTonedDown(state, flightId);

    return {
      isHighlighted,
      isTonedDown,
      flight
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