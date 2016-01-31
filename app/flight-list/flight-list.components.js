(function() {

/**
 * @ngdoc overview
 * @name 4me.ui.spvr.mapping.ctrlroom.components
 * @description
 * # Control room components
 * Control room components
 **/
var xmanFlightListComponents = angular.module('4me.ui.cwp.xman.flight-list.components', [
  '4me.core.lodash',
  '4me.ui.cwp.xman.services'
]);

xmanFlightListComponents.component('fmeXmanFlightList', {
  restrict: 'E',
  controller: xmanFlightListController,
  controllerAs: 'xmanFlightList',
  templateUrl: 'views/cwp.xman/app/flight-list/flight-list.tpl.html'
});

xmanFlightListComponents.component('fmeXmanFlightRow', {
  restrict: 'E',
  controller: xmanFlightRowController,
  bindings: {
    flight: '='
  },
  controllerAs: 'xmanFlightRow',
  templateUrl: 'views/cwp.xman/app/flight-list/flight-row.tpl.html'
});

xmanFlightListComponents.component('fmeXmanSpeedMach', {
  restrict: 'E',
  controller: xmanSpeedMachController,
  bindings: {
    flight: '='
  },
  controllerAs: 'xmanSpeedMach',
  templateUrl: 'views/cwp.xman/app/flight-list/speed-mach.tpl.html'
});

xmanFlightListComponents.component('fmeXmanAppliedBy', {
  restrict: 'E',
  controller: xmanAppliedByController,
  bindings: {
    flight: '='
  },
  controllerAs: 'xmanAppliedBy',
  templateUrl: 'views/cwp.xman/app/flight-list/applied-by.tpl.html'
});

xmanFlightListComponents.component('fmeXmanDelay', {
  restrict: 'E',
  controller: xmanDelayController,
  bindings: {
    flight: '='
  },
  controllerAs: 'xmanDelay',
  templateUrl: 'views/cwp.xman/app/flight-list/delay.tpl.html'
});

xmanFlightListController.$inject = ['xmanFlights'];
function xmanFlightListController(xmanFlights) {
  var xmanFlightList = this;

  xmanFlightList.flights = [];

  xmanFlights.getAll().then(function(data) {
    xmanFlightList.flights = data;
  });

  xmanFlightList.isLoading = xmanFlights.isLoading;

}

xmanFlightRowController.$inject = ['_'];
function xmanFlightRowController(_) {
  var xmanFlightRow = this;

  xmanFlightRow.getArcid = function() {
    return flight.arcid;
  };

}

xmanSpeedMachController.$inject = ['mySector'];
function xmanSpeedMachController(mySector) {
  var xmanSpeedMach = this;

  xmanSpeedMach.isDisabled = function() {
    return _.isEqual(xmanSpeedMach.flight.proposal.machReduction, 0);
  };

  xmanSpeedMach.getMachProposal = function() {
    return xmanSpeedMach.proposal.machReduction;
  };

  xmanSpeedMach.possibleSpeeds = [0, 1, 2, 3, 4];

  xmanSpeedMach.getMcsButtonClass = function() {
    if(_.get(xmanSpeedMach.flight, 'currentStatus.minimumCleanSpeed') === true) {
      return 'md-primary';
    }

    return '';
  };

  xmanSpeedMach.toggleMcs = function() {
    xmanSpeedMach.flight.toggleMcs(mySector.get().sectors);
  };

  xmanSpeedMach.getButtonClassForSpeed = function(s) {
    
    if(_.get(xmanSpeedMach.flight, 'currentStatus.machReduction') === s) {
      return 'md-primary';
    }

    if(xmanSpeedMach.flight.proposal.machReduction === s) {
      return 'md-warn';
    }

    return '';
  };

  xmanSpeedMach.getUndoButtonClass = function() {
    if(_.isEmpty(xmanSpeedMach.flight.currentStatus)) {
      return '';
    }
    return 'md-accent';
  };

  xmanSpeedMach.isUndoButtonDisabled = function() {
    return _.isEmpty(xmanSpeedMach.flight.currentStatus);
  };

  xmanSpeedMach.setSpeed = function(s) {
    xmanSpeedMach.flight.reduceMach(mySector.get().sectors, s);
  };

  xmanSpeedMach.undoSpeed = function() {
    xmanSpeedMach.flight.currentStatus = {};
  };
}

xmanAppliedByController.$inject = ['_'];
function xmanAppliedByController(_) {
  var xmanAppliedBy = this;

  xmanAppliedBy.showApplication = function() {
    return !_.isEmpty(xmanAppliedBy.flight.currentStatus);
  };

  xmanAppliedBy.getWhen = function() {
    return _.get(xmanAppliedBy.flight, 'currentStatus.when') || 0;
  };

  xmanAppliedBy.getSectors = function() {
    return _.get(xmanAppliedBy.flight, 'currentStatus.who') || [];
  }
}

xmanDelayController.$inject = ['_'];
function xmanDelayController(_) {
  var xmanDelay = this;

  xmanDelay.getDelay = function() {
    return _.get(xmanDelay.flight, 'delay') || 0;
  };

  xmanDelay.getStyle = function() {
    var delay = this.getDelay();
    // Compute color in gradient based on delay
    var maxDelay = 20;
    var gradient = [
      '#B2FF59',
      '#FFD740',
      '#FFAB40',
      '#FF6E40',
      '#FF5252'
    ];

    var index = delay/maxDelay * (gradient.length-1);
    console.log(index);

    return {color: gradient[0]};
  };
}

}());