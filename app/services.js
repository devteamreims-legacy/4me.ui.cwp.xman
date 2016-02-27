import _ from 'lodash';
import {bindXmanEventsToSocket} from './socket-handler';

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
    // Reset query param filters
    xmanQueryParameters.resetAfterNewSectors();

    // Refresh socket subscriptions
    service.refreshSocketSubscriptions();

    // Refresh data from backend
    service.refresh();
  });

  service.refreshSocketSubscriptions = function() {
    console.log('Refreshing xmanSocket subscriptions');
    const {sectors, verticalFilter} = xmanQueryParameters.prepareParams();

    xmanSocket.emit('set_subscription_filter', {
      sectors,
      verticalFilter
    });
  };

  bindXmanEventsToSocket(xmanSocket, service);

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

    // Set socket subscriptions
    service.refreshSocketSubscriptions();

    const httpParams = xmanQueryParameters.prepareParams();

    refreshPromise = $http.get(api.rootPath + api.xman.getAll, {
      params: httpParams
    })
    .then(function(res) {
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
  console.log(flightData);
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
