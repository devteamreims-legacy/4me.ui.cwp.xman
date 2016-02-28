import _ from 'lodash';
import xmanNgRedux from '../../xmanRedux';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-row.delay
 * @description
 * # XMAN : format a delay
 *
 */
export default angular.module('4me.ui.cwp.xman.flight-row.delay', [xmanNgRedux])
.component('fmeXmanDelay', {
  restrict: 'E',
  controller: delayController,
  bindings: {
    delay: '@'
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/delay.tpl.html'
})
.name;

delayController.$inject = [];
function delayController() {
  const $ctrl = this;

  $ctrl.getDelay = function() {
    return this.delay || 0;
  };

  $ctrl.getStyle = function() {
    const delay = this.getDelay();
    // Compute color in gradient based on delay
    const maxDelay = 20;
    const gradient = [
      '#B2FF59',
      '#FFD740',
      '#FFAB40',
      '#FF6E40',
      '#FF5252'
    ];

    let index = Math.floor(delay/maxDelay * (gradient.length-1));
    index = index > (gradient.length - 1) ? gradient.length-1 : index;

    return {color: gradient[index]};
  };
}