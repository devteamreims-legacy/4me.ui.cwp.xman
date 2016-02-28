import flightList from './flight-list/';
import flightRow from './flight-row';
import listControl from './list-control';
import status from './status';

//import resultsAndHistory from './results/';
//import profile from './profile/';
//import errors from './errors/';

angular.module('4me.ui.cwp.xman.components', [
  flightList,
  flightRow,
  listControl,
  status,
//  '4me.ui.arcid.components.profile',
//  '4me.ui.arcid.components.errors',
  'angularMoment'
]);