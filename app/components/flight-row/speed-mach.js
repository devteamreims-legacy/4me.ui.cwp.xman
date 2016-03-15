import _ from 'lodash';
import xmanNgRedux from '../../xmanRedux';

import {
  setMach as setMachAction,
  setMcs as setMcsAction,
  setSpeed as setSpeedAction,
  clearAction
} from '../../actions/flight';

import {
  getFlightById,
  isActionComplete
} from '../../selectors/flight';

/**
 * @ngdoc overview
 * @name 4me.ui.cwp.xman.flight-row.speed-mach
 * @description
 * # XMAN : Speed-mach
 * Smart component to show mach buttons or speed buttons
 *
 */
export default angular.module('4me.ui.cwp.xman.flight-row.speed-mach', [xmanNgRedux])
.component('fmeXmanSpeedMach', {
  restrict: 'E',
  controller: speedMachController,
  bindings: {
    ifplId: '<'
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/speed-mach.tpl.html'
})
.component('fmeXmanMachButtons', {
  restrict: 'E',
  controller: machController,
  bindings: {
    minimumCleanSpeed: '<',
    advisedMachReduction: '<',
    appliedMachReduction: '<',
    possibleMachs: '<',
    disableUndoButton: '<',
    setMach: '&',
    toggleMcs: '&',
    clearMach: '&'
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/mach-buttons.tpl.html'
})
.component('fmeXmanSpeedButtons', {
  restrict: 'E',
  controller: speedController,
  bindings: {
    minimumCleanSpeed: '<',
    advisedSpeed: '<',
    appliedSpeed: '<',
    possibleSpeeds: '<',
    disableUndoButton: '<',
    setSpeed: '&',
    toggleMcs: '&',
    clearSpeed: '&'
  },
  templateUrl: 'views/cwp.xman/app/components/flight-row/speed-buttons.tpl.html'
})
.name;

speedMachController.$inject = ['$xmanNgRedux', '$scope', 'myCwp', 'mySector'];
function speedMachController($xmanNgRedux, $scope, myCwp, mySector) {
  const $ctrl = this;

  const getWho = () => ({
    cwp: {
      id: myCwp.get().id,
      name: myCwp.get().name
    },
    sectors: mySector.get().sectors
  });

  const mapStateToThis = (state) => {
    const ifplId = this.ifplId;
    const flight = getFlightById(state, ifplId);

    const minimumCleanSpeed = !!_.get(flight, 'currentStatus.minimumCleanSpeed');
    const currentSpeed = _.get(flight, 'currentStatus.speed', null);
    const currentMachReduction = _.get(flight, 'currentStatus.machReduction', null);

    const disableUndoButton = (
      minimumCleanSpeed === false &&
      currentSpeed === null &&
      currentMachReduction === null
    );

    // Mach mode is default
    let mode = 'mach';

    const advisedSpeed = _.get(flight, 'advisory.speed', null);

    if(advisedSpeed !== null) {
      // Switch to speed mode
      mode = 'speed';
    }

    const commonBindings = {
      flight,
      mode,
      minimumCleanSpeed,
      disableUndoButton
    };

    const modeBindings = {};

    if(mode === 'mach') {
      // Bind values
      Object.assign(modeBindings, {
        advisedMachReduction: _.get(flight, 'advisory.machReduction'),
        appliedMachReduction: _.get(flight, 'currentStatus.machReduction'),
        possibleMachs: [0, 1, 2, 3, 4]
      });

      // Create callbacks
      const setMach = (machReduction) => this.dispatch(setMachAction(ifplId, machReduction, getWho()));
      const clearMach = () => this.dispatch(clearAction(ifplId, getWho()));
      const toggleMcs = () => this.dispatch(setMcsAction(ifplId, !minimumCleanSpeed, getWho()));

      const callbacks = {
        setMach,
        clearMach,
        toggleMcs
      };

      // Bind callbacks

      Object.assign(modeBindings, callbacks);

    } else {

      Object.assign(modeBindings, {
        advisedSpeed: _.get(flight, 'advisory.speed', -1),
        appliedSpeed: _.get(flight, 'currentStatus.speed'),
        possibleSpeeds: [240, 250, 260, 270, 280].reverse()
      });

      // Create callbacks
      const setSpeed = (speed) => this.dispatch(setSpeedAction(ifplId, speed, getWho()));
      const clearSpeed = () => this.dispatch(clearAction(ifplId, getWho()));
      const toggleMcs = () => this.dispatch(setMcsAction(ifplId, !minimumCleanSpeed, getWho()));

      const callbacks = {
        setSpeed,
        clearSpeed,
        toggleMcs
      };

      Object.assign(modeBindings, callbacks);

    }

    return Object.assign(commonBindings, modeBindings);
  }

  let unsubscribe = $xmanNgRedux.connect(mapStateToThis)(this);
  $scope.$on('$destroy', unsubscribe);
}

speedController.$inject = [];
function speedController() {

  const $ctrl = this;

  $ctrl.isDisabled = () => $ctrl.advisedSpeed === null;

  const possibleClasses = {
    'md-primary': false,
    'md-raised': true,
    'md-warn': false
  };



  $ctrl.getButtonClassForSpeed = (s) => {
    const ret = Object.assign({}, possibleClasses);

    const currentSpeed = $ctrl.appliedSpeed;
    const proposedSpeed = $ctrl.advisedSpeed;

    if(currentSpeed === s) {
      Object.assign(ret, {'md-primary': true});
    } else if(proposedSpeed === s) {
      Object.assign(ret, {'md-warn': true});
      // Softer color if action is complete
      if(isActionComplete(proposedSpeed, currentSpeed, $ctrl.minimumCleanSpeed)) {
        Object.assign(ret, {'md-hue-1': true});
      }
    }

    return ret;
  };

  $ctrl.getButtonClassForMcs = () => {
    const ret = Object.assign({}, possibleClasses);

    if($ctrl.minimumCleanSpeed === true) {
      Object.assign(ret, {'md-primary': true});
    }

    return ret;
  };

  $ctrl.getButtonClassForUndo = () => {
    const ret = Object.assign({}, possibleClasses, {
      'md-accent': true,
      'md-hue-1': true
    });
    return ret;
  };
}

machController.$inject = [];
function machController() {

  const $ctrl = this;

  $ctrl.isDisabled = () => $ctrl.advisedMachReduction === 0;

  const possibleClasses = {
    'md-primary': false,
    'md-raised': true,
    'md-warn': false
  };

  $ctrl.getButtonClassForSpeed = (s) => {
    const ret = Object.assign({}, possibleClasses);

    const currentMach = $ctrl.appliedMachReduction;
    const proposedMach = $ctrl.advisedMachReduction;

    if(currentMach === s) {
      Object.assign(ret, {'md-primary': true});
    } else if(proposedMach === s) {
      Object.assign(ret, {'md-warn': true});
      // Softer color if action is complete

      // isActionComplete is independent of speed/mach mode, reverse values
      if(isActionComplete(-proposedMach, -currentMach, $ctrl.minimumCleanSpeed)) {
        Object.assign(ret, {'md-hue-1': true});
      }
    }

    return ret;
  };

  $ctrl.getButtonClassForMcs = () => {
    const ret = Object.assign({}, possibleClasses);

    if($ctrl.minimumCleanSpeed === true) {
      Object.assign(ret, {'md-primary': true});
    }

    return ret;
  };

  $ctrl.getButtonClassForUndo = () => {
    const ret = Object.assign({}, possibleClasses, {
      'md-accent': true,
      'md-hue-1': true
    });
    return ret;
  };
}


