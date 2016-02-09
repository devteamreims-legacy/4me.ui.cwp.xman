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

xmanHighlightControlController.$inject = ['_', 'xmanFlights', 'xmanHighlighter'];
function xmanHighlightControlController(_, xmanFlights, xmanHighlighter) {

  let currentFilter = xmanHighlighter.getFilter();

  // Highlight stuff to do by default
  xmanHighlighter.togglePendingAction(true);

  // byTodo
  this.filterByTodo = () => currentFilter.pendingAction.active;
  this.toggleFilterByTodo = () => {
    console.log('Toggling pending action highlighter');
    xmanHighlighter.togglePendingAction();
    console.log(this.filterByTodo());
  };

  // byFlightLevel

  this.filterByFlightLevel = () => currentFilter.flightLevel.active;
  
  this.toggleFilterByFlightLevel = () => {
    console.log('Toggling FL highlighter');
    xmanHighlighter.toggleFlightLevel();
    console.log(this.filterByFlightLevel());
  };

  this.isByFlightLevelDisabled = () => _.isEmpty(currentFilter.flightLevel.values);

  this.getByFlightLevelString = () => {
    if(this.isByFlightLevelDisabled()) {
      return '';
    }

    let r = ' (';

    r += currentFilter.flightLevel.values.join(', ');
    r += ')';

    return r;
  }

  // byDestination
  this.filterByDestination = () => currentFilter.destination.active;
  
  this.toggleFilterByDestination = () => {
    console.log('Toggling destination highlighter');
    xmanHighlighter.toggleDestination();
    console.log(this.filterByDestination());
  };

  this.isByDestinationDisabled = () => _.isEmpty(currentFilter.destination.values);

  this.getByDestinationString = () => {
    if(this.isByDestinationDisabled()) {
      return '';
    }
    let r = ' (';
    r += currentFilter.destination.values.join(', ');
    r += ')';
    return r;
  }

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

