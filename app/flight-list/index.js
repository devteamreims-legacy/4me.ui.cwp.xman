import components from './components';
import services from './services';
import controlComponents from './control/';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-list
 * @description
 * # XMAN Flight List
 *
 * Meta module to include flight list components/services
 */
angular.module('4me.ui.cwp.xman.flight-list', [
  '4me.ui.cwp.xman.flight-list.components',
  '4me.ui.cwp.xman.flight-list.control.components',
  '4me.ui.cwp.xman.flight-list.services'
]);
