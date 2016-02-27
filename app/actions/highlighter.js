

export const XMAN_HIGHLIGHTER_TOGGLE_PENDING_ACTION = 'XMAN_HIGHLIGHTER_TOGGLE_PENDING_ACTION';
export const XMAN_HIGHLIGHTER_SET_TONE_DOWN = 'XMAN_HIGHLIGHTER_SET_TONE_DOWN';
export const XMAN_HIGHLIGHTER_CLEAR_TONE_DOWN = 'XMAN_HIGHLIGHTER_CLEAR_TONE_DOWN';

export function togglePendingAction() {
  return {
    type: XMAN_HIGHLIGHTER_TOGGLE_PENDING_ACTION
  };
}

export function setToneDownFilter(path, value) {
  return {
    type: XMAN_HIGHLIGHTER_SET_TONE_DOWN,
    path,
    value
  };
}

export function clearToneDownFilter() {
  return {
    type: XMAN_HIGHLIGHTER_CLEAR_TONE_DOWN
  };
}