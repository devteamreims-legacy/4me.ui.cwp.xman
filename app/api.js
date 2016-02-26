/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.api
 * @description
 * A single service called xman.api which provides api urls for the whole organ
 */


angular.module('4me.ui.cwp.xman.api', [])
.constant('cwp.xman.api', {
  rootPath: 'http://' + window.location.hostname + ':3001',
  xman: {
    getAll: '/xman',
    setCurrentStatus: (flightId) => `/xman/${flightId}/setCurrentStatus`
  },
  socket: 'http://' + window.location.hostname + ':3001'
});
