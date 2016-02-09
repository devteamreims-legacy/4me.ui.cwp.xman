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
  destination: 'LSZH',
  position: {
    currentFlightLevel: 283,
    plannedFlightLevel: 360,
    rangeToCop: 153,
    when: Date.now() - 10*1000
  },
  cop: 'ABNUR',
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 2,
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
  delay: 48,
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

xmanFlights.$inject = ['_', '$http', '$q', 'cwp.xman.api', 'cwp.xman.errors', '$timeout', '$rootScope'];
function xmanFlights(_, $http, $q, api, errors, $timeout, $rootScope) {
  var service = {};

  var refreshPromise = null;
  var flights = [];
  var bootstrapped = false;
  var isLoading = true;

  var queryParameters = {
    sectors: [],
    verticalFilter: true
  };

  $rootScope.$on('fme:new-sectors', function() {
    console.log('Sectors changed for XMAN !!');
  });

  service.bootstrap = function() {
    var self = this;
    if(!bootstrapped) {
      return self.refresh();
    }
    return $q.resolve(flights);
  };

  service.getAll = function() {
    var self = this;
    return self.bootstrap();
  };

  service.refresh = () => {
    if(refreshPromise !== null) {
      return refreshPromise;
    }

    isLoading = true;
    // Clean up current data while keeping reference
    // Fuck this shit, praise redux :(
    flights.length = 0;

    refreshPromise = $timeout(() => {
      console.log('Refreshing XMAN data with these options :');
      console.log(queryParameters);
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
  };

  service.isLoading = function() {
    return !!isLoading;
  };

  service.setVerticalFilter = function(verticalFilter) {
    queryParameters.verticalFilter = !!verticalFilter;
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
