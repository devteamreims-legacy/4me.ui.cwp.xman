import _ from 'lodash';

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
  '4me.core.sectors.services',
  '4me.ui.cwp.xman.errors',
  '4me.ui.cwp.xman.api',
  '4me.ui.cwp.xman.socket',
  '4me.ui.cwp.xman.status'
])
.factory('xmanFlights', xmanFlights)
.constant('xmanDestinations', ['EGLL', 'LSZH'])
.factory('xmanQueryParameters', xmanQueryParameters);

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
  cop: 'BLM',
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
    who: {
      cwpId: 23,
      sectors: ['UF', 'KF'],
    },
    machReduction: 1,
    speed: null,
    minimumCleanSpeed: true
  }
},{
  flightId: 12346,
  arcid: 'AFR1015',
  destination: 'LSZH',
  cop: 'BLM',
  estimatedTimeOverCop: Date.now() + 1000*60*12,
  delay: 12,
  position: {
    currentFlightLevel: 310,
    plannedFlightLevel: 310,
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

/*eslint-disable angular/di-unused*/
xmanFlights.$inject = ['$http', '$q', 'cwp.xman.api', 'cwp.xman.status', '$timeout', '$rootScope', 'xmanQueryParameters', 'xmanSocket'];
function xmanFlights($http, $q, api, status, $timeout, $rootScope, xmanQueryParameters, xmanSocket) {

  var service = {};

  var refreshPromise = null;
  var flights = [];
  var bootstrapped = false;
  var isLoading = true;

  var queryParameters = {
    sectors: [],
    verticalFilter: true
  };

  let handler = $rootScope.$on('fme:new-sectors', function() {
    console.log('Sectors changed for XMAN !!');
    console.log('Resetting query filters');
    xmanQueryParameters.resetAfterNewSectors();
    service.refresh();
  });

  if(xmanSocket.on) {
    xmanSocket.on('update_status', (data) => {
      console.log(data);

      if(isLoading === true) {
        console.log('Got socket data while loading data, discard socket data');
        return;
      }

      if(data.flightId === undefined) {
        console.log('Got empty data from socket');
        return;
      }

      // Check machReduction here

      let flight = _.find(flights, f => f.flightId === data.flightId);
      
      if(_.isEmpty(flight)) {
        console.log(`Flight with id ${data.flightId} is not tracked, dismissing ...`);
        return;
      }

      

      delete data.flightId;

      flight.setCurrentStatus(data);


    });
  }

  service.bootstrap = function() {
    if(!bootstrapped) {
      return this.refresh();
    }
    return $q.resolve(flights);
  };

  service.getAll = function() {
    return this.bootstrap();
  };

  service.refresh = () => {
    if(refreshPromise !== null) {
      return refreshPromise;
    }

    isLoading = true;
    // Clean up current data while keeping reference
    // Fuck this shit, praise redux :(
    flights.length = 0;

    refreshPromise = $http.get(api.rootPath + api.xman.getAll, {
      params: xmanQueryParameters.prepareParams()
    })
    .then(function(res) {
      console.log(res.data);
      const data = _.clone(stubData);
      // Process data here
      _.map(res.data, f => flights.push(new XmanFlight(f)));
      
      refreshPromise = null;
      bootstrapped = true;
      isLoading = false;
      status.recover('getFlightList');
      return flights;
    })
    .catch((err) => {
      refreshPromise = null;
      bootstrapped = false;
      isLoading = false;
      status.escalate('getFlightList', 'critical', 'Could not get flight list from backend');
    });

    return refreshPromise;
  };

  service.isLoading = () => !!isLoading;

  return service;

}
/*eslint-enable angular/di-unused*/

function XmanFlight(flightData) {
  Object.assign(this, flightData);
}

XmanFlight.prototype.setCurrentStatus = function(status) {
  Object.assign(this.currentStatus, status);
  return this;
}

XmanFlight.prototype.reduceMach = function reduceMach(who, machReduction, when) {
  var currentStatus = {
    when: when || Date.now(),
    who: who || {},
    machReduction: machReduction
  };
  Object.assign(this.currentStatus, currentStatus);
  return this;
};

XmanFlight.prototype.toggleMcs = function(who, value, when) {
  let mcs;
  if(value === undefined) {
    mcs = !this.currentStatus.minimumCleanSpeed;
  } else {
    mcs = !!value;
  }
  
  const currentStatus = {
    when: when || Date.now(),
    who: who || {},
    minimumCleanSpeed: mcs
  };
  Object.assign(this.currentStatus, currentStatus);
  return this;
};

xmanQueryParameters.$inject = ['mySector', 'xmanDestinations'];
function xmanQueryParameters(mySector, xmanDestinations) {
  let defaults = {
    // Other query parameters can be set here
  };

  let service = {};

  let parameters = {
    geographicalFilter: !_.isEmpty(mySector.get().sectors),
    verticalFilter: !_.isEmpty(mySector.get().sectors),
    destinationFilter: _.clone(xmanDestinations)
  };


  service.prepareParams = () => {
    let ret = Object.assign({}, defaults);
    if(parameters.destinationFilter !== undefined) {
      ret.destinations = parameters.destinationFilter;
    }

    if(parameters.geographicalFilter === true) {
      ret.sectors = _.clone(mySector.get().sectors);
    }

    if(parameters.verticalFilter === true) {
      ret.verticalFilter = true;
    }

    return ret;
  };

  service.resetAfterNewSectors = () => {
    if(!_.isEmpty(mySector.get().sectors)) {
      return;
    } else {
      parameters.geographicalFilter = false;
      parameters.verticalFilter = false;
    }
  }

  service.get = () => parameters;

  service.setDestinations = (destinations) => {

    if(!_.isArray(destinations)) {
      destinations = [destinations];
    }
    let unknownDestinations = _.without(destinations, ...xmanDestinations);

    if(!_.isEmpty(unknownDestinations)) {
      throw new Error('Unknown destinations found : ' + unknownDestinations.join(','));
    }

    if(_.isEmpty(destinations)) {
      delete parameters.destinationFilter;
      return;
    }

    parameters.destinationFilter = destinations;
    return;
  };


  service.toggleGeographicalFilter = (val) => {
    if(val !== undefined) {
      parameters.geographicalFilter = !!val;
    } else {
      parameters.geographicalFilter = !parameters.geographicalFilter;
    }

    if(parameters.geographicalFilter === false) {
      parameters.verticalFilter = false;
    }
  };

  service.toggleVerticalFilter = (val) => {
    if(parameters.geographicalFilter !== true) {
      throw new Error('Cannot set vertical filter if geographical filter is disabled');
    }
    if(val !== undefined) {
      parameters.verticalFilter = !!val;
    } else {
      parameters.verticalFilter = !parameters.verticalFilter;
    }
  };



  service.isVerticalFilterAllowed = () => parameters.geographicalFilter && service.isGeographicalFilterAllowed();
  service.isGeographicalFilterAllowed = () => !_.isEmpty(mySector.get().sectors);

  return service;
}
