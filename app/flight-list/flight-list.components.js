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

  // True if action needed,
  // False if everything is done
  function isActionComplete(flight) {
    var minCleanSpeed = _.get(flight, 'currentStatus.minimumCleanSpeed');
    var currentMach = _.get(flight, 'currentStatus.machReduction') || -1;
    var proposedMach = _.get(flight, 'proposal.machReduction');

    if(_.get(flight, 'currentStatus.minimumCleanSpeed') === true) {
      return true;
    }
    if(currentMach >= proposedMach) {
      return true;
    }
    return false;
  }

  xmanSpeedMach.possibleSpeeds = [0, 1, 2, 3, 4];

  var possibleClasses = {
    'md-primary': false,
    'md-raised': true,
    'md-warn': false
  };

  xmanSpeedMach.getMcsButtonClass = function() {
    var ret = Object.assign({}, possibleClasses);

    if(_.get(xmanSpeedMach.flight, 'currentStatus.minimumCleanSpeed') === true) {
      Object.assign(ret, {'md-primary': true});
    }

    if(isActionComplete(xmanSpeedMach.flight)) {
      Object.assign(ret, {'md-raised': false});
    }


    return ret;
  };

  xmanSpeedMach.toggleMcs = function() {
    xmanSpeedMach.flight.toggleMcs(mySector.get().sectors);
  };



  xmanSpeedMach.getButtonClassForSpeed = function(s) {
    var ret = Object.assign({}, possibleClasses);

    var currentMach = _.get(xmanSpeedMach.flight, 'currentStatus.machReduction');
    var proposedMach = _.get(xmanSpeedMach.flight, 'proposal.machReduction');

    if(currentMach === s) {
      Object.assign(ret, {'md-primary': true});
    } else if(proposedMach === s) {
      Object.assign(ret, {'md-warn': true});
    }

    if(currentMach !== s && isActionComplete(xmanSpeedMach.flight)) {
      Object.assign(ret, {'md-raised': false});
    }

    return ret;
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
    return _.get(xmanAppliedBy.flight, 'currentStatus.when') || null;
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

    var index = Math.floor(delay/maxDelay * (gradient.length-1));
    index = index > (gradient.length - 1) ? gradient.length-1 : index;

    return {color: gradient[index]};
  };
}

}());
