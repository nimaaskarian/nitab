export function toggleTaskbarEdit() {
  return { type: "TOGGLE_TASKBAR_EDIT" };
}
export function setTerm(term) {
  return { type: "SET_TERM", payload: term };
}
export function setTimerEditFocus(focus) {
  return { type: "SET_TIMER_EDIT_FOCUS", payload: focus };
}
export function setBackground(bg) {
  return {
    type: "SET_BACKGROUND",
    payload: bg,
  };
}
export function setEditTaskbarIndex(index) {
  return {
    type: "SET_EDIT_TASKBAR_INDEX",
    payload: index,
  };
}
export function setTempColor(color) {
  return {
    type: "SET_TEMP_COLOR",
    payload: color,
  };
}
export function toggleIsFetchingImage() {
  return {
    type: "TOGGLE_IS_FETCHING_IMAGE",
  };
}
export function setCurrentDragging(index) {
  return {
    type: "SET_CURRENT_DRAGGING",
    payload: index,
  };
}
export function setImageLoaded(loaded) {
  return {
    type: "SET_IMAGE_LOADED",
    payload: loaded,
  };
}
export function setTempIcon(icon) {
  return {
    type: "SET_TEMP_ICON",
    payload: icon,
  };
}
