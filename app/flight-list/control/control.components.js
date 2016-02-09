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
  '4me.core.lodash',
  '4me.ui.cwp.xman.services',
  '4me.ui.cwp.xman.flight-list.services'
]);

xmanControlComponents.component('fmeXmanHighlightControl', {
  restrict: 'E',
  controller: xmanHighlightControlController,
  templateUrl: 'views/cwp.xman/app/flight-list/control/highlight.control.tpl.html'
});

xmanControlComponents.component('fmeXmanFilterControl', {
  restrict: 'E',
  controller: xmanFilterControlController,
  templateUrl: 'views/cwp.xman/app/flight-list/control/filter.control.tpl.html'
});

xmanHighlightControlController.$inject = ['_', 'xmanFlights', 'xmanHighlighter', '$rootScope'];
function xmanHighlightControlController(_, xmanFlights, xmanHighlighter, $rootScope) {
  let xmanHighlightControl = this;

  let currentFilter = xmanHighlighter.getFilter();

  xmanHighlighter.togglePendingAction(true);
  
  xmanHighlightControl.filterByTodo = currentFilter.pendingAction.active;

  xmanHighlightControl.toggleFilterByTodo = () => {
    console.log('Toggling pending action highlighter');
    xmanHighlightControl.filterByTodo = xmanHighlighter.togglePendingAction();
    console.log(xmanHighlightControl.filterByTodo);
  };

  xmanHighlightControl.filterByFlightLevel = currentFilter.flightLevel.active;

  xmanHighlightControl.toggleFilterByFlightLevel = () => {
    console.log('Toggling FL highlighter');
    xmanHighlightControl.filterByFlightLevel = xmanHighlighter.toggleFlightLevel();
    console.log(xmanHighlightControl.filterByFlightLevel);
  };

  xmanHighlightControl.filterByDestination = currentFilter.destination.active;

  xmanHighlightControl.toggleFilterByDestination = () => {
    console.log('Toggling destination highlighter');
    xmanHighlightControl.filterByDestination = xmanHighlighter.toggleDestination();
    console.log(xmanHighlightControl.filterByDestination);
  };
}

xmanFilterControlController.$inject = ['_', 'xmanFlights'];
function xmanFilterControlController(_, xmanFlights) {

  // Defaults
  this.verticalFilter = false;
  this.possibleDestinations = ['EGLL', 'LSZH'];
  this.destinationFilter = _.clone(this.possibleDestinations);
  this.geographicalFilter = false;

  this.toggleVerticalFilter = () => {
    console.log('Toggling verticalFilter in filter control');
    this.verticalFilter = !this.verticalFilter;
    xmanFlights.refresh();
    console.log(this.verticalFilter);
  };

  this.toggleGeographicalFilter = () => {
    console.log('Toggling geographicalFilter');
    this.geographicalFilter = !this.geographicalFilter;
    xmanFlights.refresh();
    console.log(this.verticalFilter);
  };

  this.updateDestinationFilter = () => {
    console.log('Event fired !');
    console.log('Select value :', this.destinationFilter);
    if(_.isEmpty(this.destinationFilter)) {
      this.destinationFilter = _.clone(this.possibleDestinations);
    }
    xmanFlights.refresh();
  };

}


}());

