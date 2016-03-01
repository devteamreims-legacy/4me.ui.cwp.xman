import flightList from './flight-list/';
import flightRow from './flight-row';
import listControl from './list-control';
import status from './status';

export default angular.module('4me.ui.cwp.xman.components', [
  flightList,
  flightRow,
  listControl,
  status
])
.name;