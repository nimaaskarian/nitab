import types from "store/types/ui";

export function toggleTaskbarEdit() {
  return { type: types.TOGGLE_TASKBAR_EDIT };
}
export function setTerm(term) {
  return { type: types.SET_TERM, payload: term };
}
export function setEditTaskbarIndex(index) {
  return {
    type: types.SET_EDIT_TASKBAR_INDEX,
    payload: index,
  };
}
export function setIsFetchingImage() {
  return {
    type: types.SET_IS_FETCHING_IMAGE,
  };
}
export function setCurrentDragging(index) {
  return {
    type: types.SET_CURRENT_DRAGGING,
    payload: index,
  };
}
export function setImageLoaded(loaded) {
  return {
    type: types.SET_IMAGE_LOADED,
    payload: loaded,
  };
}
