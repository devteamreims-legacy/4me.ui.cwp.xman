(function() {
'use strict';
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
      // Organ modules
      '4me.ui.cwp.xman.errors',
      '4me.ui.cwp.xman.notifications',
      '4me.ui.cwp.xman.status',
      '4me.ui.cwp.xman.flight-list'
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
  $stateProvider.state('bootstrapped.xman-cwp', {
    url: '/xman',
    templateUrl: 'views/cwp.xman/app/index.tpl.html',
    resolve: {
      xmanFlights: function() { return true; }
    }
  });
};

mappingRegistration = ['mainOrganService', '$state', '$injector'];
function mappingRegistration(mainOrganService, $state, $injector) {
  var r = mainOrganService.register({
    name: 'xman',
    navigateTo: function() {
      $state.go('bootstrapped.xman-cwp');
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

angular.module('4me.ui.cwp.xman.errors', [
  '4me.core.lodash',
  '4me.core.errors'
])
.factory('cwp.xman.errors', mappingErrors);

mappingErrors.$inject = ['_', 'errors'];
function mappingErrors(_, errors) {
  var service = {};

  service.add = function(type, message, reason) {
    return errors.add('cwp.xman', type, message, reason);
  };

  return _.defaults(service, errors);
}

angular.module('4me.ui.cwp.xman.notifications', [
  '4me.core.lodash',
  '4me.core.notifications'
])
.factory('cwp.xman.notifications', mappingNotifications);

mappingNotifications.$inject = ['_', 'notifications'];
function mappingNotifications(_, notifications) {
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
angular.module('4me.ui.cwp.xman.status', [
  '4me.core.lodash',
  '4me.core.status'
])
.factory('cwp.xman.status', mappingStatus);

mappingStatus.$inject = ['statusFactory'];
function mappingStatus(statusFactory) {
  var service = statusFactory.get('cwp.xman');
  return service;
}


xmanController.$inject = ['cwp.xman.errors', 'cwp.xman.notifications', '$state', 'ctrlroomManager'];
function xmanController(errors, notifications, $state, xmanFlights) {
  var xman = this;

  xman.isLoading = function() {
    return xmanFlights.isLoading();
  };
}

}());
