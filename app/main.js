import _ from 'lodash';

import components from './components/';

import xmanNgRedux from './xmanRedux';
import rootReducer from './reducers/';
import thunk from 'redux-thunk';
import deepFreeze from 'redux-freeze';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux';

import { bootstrap } from './bootstrap';

import {
  onSectorChange,
  onCwpChange
} from './actions/who-am-i';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman
 * @description
 * # 4me.ui.cwp.xman
 *
 * 4me Organ to manage XMAN information on CWPs
 */
var m = angular
  .module('4me.ui.cwp.xman', [
      'ui.router',
      '4me.core.config',
      '4me.core.notifications',
      '4me.core.errors',
      '4me.core.organs.services',
      '4me.core.status',
      '4me.core.cwp.services',
      '4me.core.sectors.services',
      // Organ modules
      '4me.ui.cwp.xman.components',
      'xmanNgRedux'
  ]);

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman
 * @description
 * # 4me.ui.cwp.xman register states
 *
 * Register organ states here
 */

m.config(mappingConfig);
m.run(mappingRegistration);

mappingConfig.$inject = ['$stateProvider'];
function mappingConfig($stateProvider) {
  $stateProvider.state('xman-cwp', {
    parent: 'bootstrapped',
    url: '/xman',
    templateUrl: 'views/cwp.xman/app/index.tpl.html'
  });
};

mappingRegistration.$inject = ['mainOrganService', '$state', '$injector'];
function mappingRegistration(mainOrganService, $state, $injector) {
  var r = mainOrganService.register({
    name: 'xman',
    isActive: () => $state.includes('xman-cwp'),
    navigateTo: function() {
      $state.go('xman-cwp');
    },
    getNotificationService: function() {
      return $injector.get('cwp.xman.notifications');
    },
    getStatusService: function() {
      return $injector.get('cwp.xman.status');
    }
  });
}

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman
 * @description
 * # Decorator for core functions
 *
 * Provides decorated services for core functions :
 * * Error management
 * * Notifications
 *
 */

m.factory('cwp.xman.errors', mappingErrors);

mappingErrors.$inject = ['errors'];
function mappingErrors(errors) {
  var service = {};

  service.add = function(type, message, reason) {
    return errors.add('cwp.xman', type, message, reason);
  };

  return _.defaults(service, errors);
}

m.factory('cwp.xman.notifications', mappingNotifications);

mappingNotifications.$inject = ['notifications'];
function mappingNotifications(notifications) {
  var service = {};

  service.add = function(priority, title, props) {
    return notifications.add('cwp.xman', priority, title, props);
  };

  service.get = function() {
    return _.filter(notifications.get(), function(n) {
      return n.sender === 'cwp.xman';
    })
  };

  return _.defaults(service, _.clone(notifications));
}


// We need another full service here, not some proxy status service
m.factory('cwp.xman.status', mappingStatus);

mappingStatus.$inject = ['statusFactory'];
function mappingStatus(statusFactory) {
  var service = statusFactory.get('cwp.xman');
  return service;
}


m.config(setupRedux);

setupRedux.$inject = ['$xmanNgReduxProvider'];
function setupRedux($xmanNgReduxProvider) {
  const ignoreFilter = (getState, action) => {
    const filterActionsContaining = 'TONE_DOWN';

    return !_.includes(action.type, filterActionsContaining);
  }

  const logger = createLogger({
    predicate: ignoreFilter
  });
  $xmanNgReduxProvider.createStoreWith(rootReducer, [thunk, deepFreeze, logger]);
}

m.run(bootstrapXman);

bootstrapXman.$inject = ['$xmanNgRedux', '$rootScope', 'myCwp', 'mySector'];
function bootstrapXman($xmanNgRedux, $rootScope, myCwp, mySector) {
  const store = $xmanNgRedux;

  bootstrap(store, $rootScope, myCwp, mySector);
}
