(function() {
'use strict';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.services
 * @description
 * # XMAN services
 *
 * CWP XMAN Services
 */
angular.module('4me.ui.cwp.xman.services', [
  '4me.core.config',
  '4me.core.lodash',
  '4me.core.sectors.services',
  '4me.ui.cwp.xman.errors',
  '4me.ui.cwp.xman.api',
  '4me.ui.cwp.xman.status'
])
.factory('xmanFlights', xmanFlights);

var stubData = [
{
  flightId: 12345,
  arcid: 'BAW164',
  destination: 'EGLL',
  position: {
    currentFlightLevel: 283,
    plannedFlightLevel: 360,
    rangeToCop: 153,
    when: Date.now() - 10*1000
  },
  cop: 'ABNUR',
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 0,
  proposal: {
    machReduction: 2,
    speed: null,
    when: Date.now() - 1000*60*4,
    targetTimeOverCop: Date.now() + 1000*60*15
  },
  currentStatus: {
    when: Date.now(),
    who: ['UF', 'KF'],
    machReduction: 1,
    speed: null,
    minimumCleanSpeed: true
  }
},{
  flightId: 12346,
  arcid: 'AFR1015',
  destination: 'EGLL',
  cop: 'ABNUR',
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 12,
  position: {
    currentFlightLevel: 380,
    plannedFlightLevel: 380,
    rangeToCop: 160,
    when: Date.now() - 9*1000
  },
  proposal: {
    machReduction: 0,
    speed: null,
    when: Date.now() - 1000*60*4
  },
  currentStatus: {}
},{
  flightId: 12346,
  arcid: 'MSR777',
  destination: 'EGLL',
  cop: 'ABNUR',
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 26,
  position: {
    currentFlightLevel: 380,
    plannedFlightLevel: 380,
    rangeToCop: 160,
    when: Date.now() - 9*1000
  },
  proposal: {
    machReduction: 4,
    speed: null,
    when: Date.now() - 1000*60*4
  },
  currentStatus: {}
}];

xmanFlights.$inject = ['_', '$http', '$q', 'cwp.xman.api', 'cwp.xman.errors', '$timeout'];
function xmanFlights(_, $http, $q, api, errors, $timeout) {
  var service = {};

  var refreshPromise = null;
  var flights = [];
  var bootstrapped = false;
  var isLoading = true;

  service.bootstrap = function() {
    var self = this;
    if(!bootstrapped) {
      refreshPromise = $timeout(function() {
        return $q.resolve(stubData);
      }, 1000)
      .then(function(data) {
        // Process data here
        _.map(data, function(f) {
          flights.push(new XmanFlight(f));
        });
        refreshPromise = null;
        bootstrapped = true;
        isLoading = false;
        return flights;
      });
      return refreshPromise;
    }
    return $q.resolve(flights);
  };

  service.getAll = function() {
    var self = this;
    return self.bootstrap().then(function() {
      return flights;
    })
  };

  service.isLoading = function() {
    return !!isLoading;
  };




  return service;

}

function XmanFlight(flightData) {
  Object.assign(this, flightData);
}

XmanFlight.prototype.reduceMach = function reduceMach(who, machReduction) {
  var currentStatus = {
    when: Date.now(),
    who: who || [],
    machReduction: machReduction
  };
  Object.assign(this.currentStatus, currentStatus);
  return this;
};

XmanFlight.prototype.toggleMcs = function(who) {
  var mcs = !this.currentStatus.minimumCleanSpeed;
  var currentStatus = {
    when: Date.now(),
    who: who || [],
    minimumCleanSpeed: mcs
  };
  Object.assign(this.currentStatus, currentStatus);
  return this;
};

}());
