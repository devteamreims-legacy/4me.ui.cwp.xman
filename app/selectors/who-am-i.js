

export const getMySectors = (state) => _.get(state, 'whoAmI.sectors', []);

export const getMyCwp = (state) => _.get(state, 'whoAmI.cwp', {});

export const getMyCwpId = (state) => _.get(getMyCwp(state), 'id', -1);
export const getMyCwpName = (state) => _.get(getMyCwp(state), 'name', '');

