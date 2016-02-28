import _ from 'lodash';


export const getStatusLevel = (state) => _.get(state, 'status.level', 'normal');
export const getStatusMessage = (state) => _.get(state, 'status.message', '');
export const getLastUpdated = (state) => _.get(state, 'status.lastUpdated', 0);

export const isNormal = (state) => getStatusLevel(state) === 'normal';
export const isWarning = (state) => getStatusLevel(state) === 'warning';
export const isCritical = (state) => getStatusLevel(state) === 'critical';

export const isErrored = (state) => isWarning(state) || isCritical(state);

export const getStatus = (state) => {
  const level = getStatusLevel(state);
  const lastUpdated = getLastUpdated(state);
  const message = getStatusMessage(state);

  return {
    level,
    lastUpdated,
    message
  };
}

