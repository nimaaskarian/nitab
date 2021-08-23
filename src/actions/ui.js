export function toggleTaskbarEdit() {
  return (dispatch, getStore) => {
    const prevTaskbarEdit = getStore().ui.isTaskbarEdit;
    dispatch({ type: "TOGGLE_TASKBAR_EDIT", payload: !prevTaskbarEdit });
  };
}
export function setTerm(term) {
  return { type: "SET_TERM", payload: term };
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
export function setIsTerminal(isTerminal) {
  return {
    type: "SET_ISTERMINAL",
    payload: isTerminal,
  };
}