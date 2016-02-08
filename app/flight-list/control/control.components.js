(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-list
 * @description
 * # XMAN Flight List control components
 *
 * Components related to flight-list controls
 */
var xmanControlComponents = angular.module('4me.ui.cwp.xman.flight-list.control.components', [
  '4me.core.lodash'
]);

xmanControlComponents.component('fmeXmanControl', {
  restrict: 'E',
  controller: xmanControlController,
  controllerAs: 'xmanControl',
  templateUrl: 'views/cwp.xman/app/flight-list/control/control.tpl.html'
});

xmanControlController.$inject = ['_'];
function xmanControlController(_) {
  var xmanControl = this;
}


}());

