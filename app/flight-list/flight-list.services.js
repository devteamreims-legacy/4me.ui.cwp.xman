(function() {
'use strict';
/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-list.services
 * @description
 * # XMAN Flight List services
 * XMAN Flight List services
 **/

var xmanFlightListServices = angular.module('4me.ui.cwp.xman.flight-list.services', [
  '4me.core.lodash',
  '4me.ui.cwp.xman.services'
]);

xmanFlightListServices.factory('xmanFilterService', xmanFilterService);


xmanFilterService.$inject = ['_'];
function xmanFilterService(_) {
  var service = {};

  var filter = {
    destination: [],
    flightLevel: [380, 360],
    cop: []
  };

  filter.destination.push('EGLL');

  service.hasStuffTodo = function(flight) {
    return true;
  };

  service.isHighlighted = (flight) => {
    return isDestinationHighlighted(filter.destination, flight) && isFlightLevelHighlighted(filter.flightLevel, flight);
  };

  function isDestinationHighlighted(destinations, flight) {
    let currentDestination = _.get(flight, 'destination');
    return _.indexOf(destinations, currentDestination) !== -1;
  }

  function isFlightLevelHighlighted(flightLevel, flight) {
    // Accepts an array : [360, 380]
    // Or an object : {minFlightLevel: 360, maxFlightLevel: 380}

    var currentFlightLevel = parseInt(_.get(flight, 'position.currentFlightLevel'));
    if(_.isArray(flightLevel)) {
      return flightLevel.map(parseInt).indexOf(currentFlightLevel) !== -1;
    }
    return false;
  }

  return service;
}

}());
