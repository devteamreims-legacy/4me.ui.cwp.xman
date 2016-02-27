import ngReduxProvider from 'ng-redux/lib/components/ngRedux';

export default angular.module('xmanNgRedux', [])
  .provider('$xmanNgRedux', ngReduxProvider)
  .name;