import _ from 'lodash';

/**
 * @ngdoc overview
 * @name 4me.ui.spvr.mapping.ctrlroom.components
 * @description
 * # Control room components
 * Control room components
 **/
var xmanFlightListComponents = angular.module('4me.ui.cwp.xman.flight-list.components', [
  '4me.ui.cwp.xman.services',
  '4me.ui.cwp.xman.flight-list.services'
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
  templateUrl: 'views/cwp.xman/app/flight-list/flight-row.tpl.html'
});

xmanFlightListComponents.component('fmeXmanSpeedMach', {
  restrict: 'E',
  controller: xmanSpeedMachController,
  bindings: {
    flight: '='
  },
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

  this.flights = [];

  xmanFlights.getAll().then((data) => this.flights = data);

  this.isLoading = xmanFlights.isLoading;

}

xmanFlightRowController.$inject = ['xmanHighlighter'];
function xmanFlightRowController(xmanHighlighter) {

  var self = this;

  this.isHighlighted = () => xmanHighlighter.isHighlighted(this.flight);

  this.getClasses = () => ({
    highlight: this.isHighlighted()
  });

  let clickOnHighlightFilter = (type, value) => xmanHighlighter.toggleValue(type, value);


  this.clickOnFlightLevel = () => clickOnHighlightFilter('flightLevel', this.flight.position.vertical.currentFlightLevel);
  this.clickOnDestination = () => clickOnHighlightFilter('destination', this.flight.destination);
  this.destinationButtonClasses = () => ({
    'md-accent md-hue-1': xmanHighlighter.isValueSelected('destination', this.flight.destination)
  });
  this.flightLevelButtonClasses = () => ({
    'md-accent md-hue-1': xmanHighlighter.isValueSelected('flightLevel', this.flight.position.vertical.currentFlightLevel)
  });

}

xmanSpeedMachController.$inject = ['mySector', 'myCwp', 'xmanHighlighter'];
function xmanSpeedMachController(mySector, myCwp, xmanHighlighter) {

  this.isDisabled = () => _.isEqual(this.flight.advisory.machReduction, 0);

  // True if action needed,
  // False if everything is done
  const isActionComplete = (flight) => !xmanHighlighter.hasPendingAction(flight);

  this.possibleSpeeds = [0, 1, 2, 3, 4];

  const possibleClasses = {
    'md-primary': false,
    'md-raised': true,
    'md-warn': false
  };

  this.getMcsButtonClass = () => {
    const ret = Object.assign({}, possibleClasses);

    if(_.get(this.flight, 'currentStatus.minimumCleanSpeed') === true) {
      Object.assign(ret, {'md-primary': true});
    }

    if(false && isActionComplete(this.flight)) {
      Object.assign(ret, {'md-raised': false});
    }


    return ret;
  };

  this.toggleMcs = () => {
    const who = {
      cwpId: myCwp.get().id,
      sectors: mySector.get().sectors
    };
    return this.flight.toggleMcs(who);
  };

  this.getButtonClassForSpeed = (s) => {
    const ret = Object.assign({}, possibleClasses);

    const currentMach = _.get(this.flight, 'currentStatus.machReduction');
    const proposedMach = _.get(this.flight, 'advisory.machReduction');

    if(currentMach === s) {
      Object.assign(ret, {'md-primary': true});
    } else if(proposedMach === s) {
      Object.assign(ret, {'md-warn': true});
      // Softer color if action is complete
      if(isActionComplete(this.flight)) {
        Object.assign(ret, {'md-hue-1': true});
      }
    }

    return ret;
  };

  this.getUndoButtonClass = () => {
    if(_.isEmpty(this.flight.currentStatus)) {
      return 'md-raised';
    }
    return 'md-raised md-accent';
  };

  this.isUndoButtonDisabled = () => _.isEmpty(this.flight.currentStatus);

  this.setSpeed = (s) => {
    const who = {
      cwpId: myCwp.get().id,
      sectors: mySector.get().sectors
    };
    return this.flight.reduceMach(who, s);
  };

  this.undoSpeed = () => {
    this.flight.currentStatus = {};
  };
}

xmanAppliedByController.$inject = [];
function xmanAppliedByController() {
  var xmanAppliedBy = this;

  xmanAppliedBy.showApplication = function() {
    return !_.isEmpty(xmanAppliedBy.flight.currentStatus);
  };

  xmanAppliedBy.getWhen = function() {
    return _.get(xmanAppliedBy.flight, 'currentStatus.when') || null;
  };

  xmanAppliedBy.getSectors = function() {
    return _.get(xmanAppliedBy.flight, 'currentStatus.who.sectors') || [];
  }
}

xmanDelayController.$inject = [];
function xmanDelayController() {
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
