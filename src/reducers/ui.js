const INITIAL_STATE = {
  isTaskbarEdit: false,
  timerEditFocus: false,
  term: "",
  results: [],
  isTerminal: false,
};

const uiReducer = (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case "TOGGLE_TASKBAR_EDIT":
      return { ...state, isTaskbarEdit: payload };
    case "SET_TERM":
      return { ...state, term: payload };
    case "SET_AC":
      return { ...state, ac: payload };
    case "SET_BACKGROUND":
      return { ...state, background: payload };
    case "SET_TIMER_EDIT_FOCUS":
      return { ...state, timerEditFocus: payload };
    case "SET_RESULTS":
      return { ...state, results: payload };
    default:
      return { ...state };
  }
};
export default uiReducer;
