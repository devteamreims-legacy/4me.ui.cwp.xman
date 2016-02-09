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

xmanFlightListServices.factory('xmanHighlighter', xmanHighlighter);


xmanHighlighter.$inject = ['_'];
function xmanHighlighter(_) {
  let service = {};

  let filters = {
    destination: {
      active: false,
      values: ['EGLL', 'LSZH'],
      truthTest: function(flight) {
        return !this.active || isDestinationHighlighted(this.values, flight)
      }
    },
    flightLevel: {
      active: false,
      values: [380],
      truthTest: function(flight) {
        return !this.active || isFlightLevelHighlighted(this.values, flight)
      }
    },
    pendingAction: {
      active: false,
      values: null,
      truthTest: function(flight) { 
        return !this.active || hasPendingAction(flight)
      }
    }
  };

  service.hasPendingAction = hasPendingAction;

  service.isHighlighted = (flight) => {
    // Nothing filtered, nothing highlighted
    if(isFilterEmpty(filters)) {
      return false;
    }

    let highlightConditions = _.map(filters, (filter) => filter.truthTest(flight));
    return _.every(highlightConditions, (c) => !!c);
  };

  service.getFilter = () => filters;

  service.togglePendingAction = (val) => toggleFilter(filters, 'pendingAction', val);
  service.toggleFlightLevel = (val) => toggleFilter(filters, 'flightLevel', val);
  service.toggleDestination = (val) => toggleFilter(filters, 'destination', val);

  function toggleFilter(filters, filterName, val) {
    let filter = _.get(filters, filterName, {});
    if(filter.active === undefined) {
      throw new Error('Tried to toggle an unknown filter')
    }
    if(val !== undefined) {
      filter.active = !!val;
    } else {
      filter.active = !filter.active;
    }
    return filter.active;
  }

  function isFilterEmpty(filters) {
    console.log('POUET');
    return _.every(filters, (f) => f.active === false);
  }

  function isFilterActive(filterName) {
    return _.get(filters, filterName + '.active', false);
  }

  function isDestinationHighlighted(destinations, flight) {
    let currentDestination = _.get(flight, 'destination');
    return _.includes(destinations, currentDestination);
  }

  function isFlightLevelHighlighted(flightLevel, flight) {
    // Accepts an array : [360, 380]
    // TODO : Or an object : {minFlightLevel: 360, maxFlightLevel: 380}
    var currentFlightLevel = parseInt(_.get(flight, 'position.currentFlightLevel'));
    if(_.isArray(flightLevel)) {
      return _.includes(flightLevel.map(parseInt), currentFlightLevel);
    }
    return false;
  }

  // True if action needed,
  // False if everything is done
  function hasPendingAction(flight) {
    let minCleanSpeed = _.get(flight, 'currentStatus.minimumCleanSpeed');
    let currentMach = _.get(flight, 'currentStatus.machReduction') || -1;
    let proposal = _.get(flight, 'proposal', {});
    let proposedMach = _.get(proposal, 'machReduction');

    // If proposal is 0, then no pending action
    if(_.isEmpty(proposal) || proposedMach === 0) {
      return false;
    }

    // If minCleanSpeed flag has been set, no pending action
    if(minCleanSpeed === true) {
      return false;
    }

    // If reduction applied is better than proposed reduction, then no pending action
    if(currentMach >= proposedMach) {
      return false;
    }

    // Else, we have pending actions
    return true;
  }

  return service;
}

}());
