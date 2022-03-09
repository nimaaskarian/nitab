export function toggleTaskbarEdit() {
  return (dispatch, getStore) => {
    const prevTaskbarEdit = getStore().ui.isTaskbarEdit;
    dispatch({ type: "TOGGLE_TASKBAR_EDIT", payload: !prevTaskbarEdit });
  };
}
export function setTerm(term) {
  return { type: "SET_TERM", payload: term };
}
export function setTimerEditFocus(focus) {
  return { type: "SET_TIMER_EDIT_FOCUS", payload: focus };
}
export function setAc(term) {
  return { type: "SET_AC", payload: term };
}
export function setBackground(bg) {
  return {
    type: "SET_BACKGROUND",
    payload: bg,
  };
}
export function setAddTaskbarIndex(index) {
  return {
    type: "SET_ADD_TASKBAR_INDEX",
    payload: index,
  };
}
export function setTempColor(color) {
  return {
    type: "SET_TEMP_COLOR",
    payload: color,
  };
}

export function setTempIcon(icon) {
  return {
    type: "SET_TEMP_ICON",
    payload: icon,
  };
}
