const INITIAL_STATE = {
  isTaskbarEdit: false,
  timerEditFocus: false,
  term: "",
  results: [],
  isTerminal: false,
  addtaskbarIndex: null,
  isFetchingImage: false,
  imageLoaded: 0,
  currentDragging: -1,
};

const uiReducer = (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case "SET_CURRENT_DRAGGING":
      return { ...state, currentDragging: payload };
    case "TOGGLE_TASKBAR_EDIT":
      return { ...state, isTaskbarEdit: payload };
    case "SET_TERM":
      return { ...state, term: payload };
    case "TOGGLE_IS_FETCHING_IMAGE":
      return { ...state, isFetchingImage: !state.isFetchingImage };
    case "SET_IMAGE_LOADED":
      return { ...state, imageLoaded: payload };
    case "SET_BACKGROUND":
      return { ...state, background: payload };
    case "SET_TIMER_EDIT_FOCUS":
      return { ...state, timerEditFocus: payload };
    case "SET_RESULTS":
      return { ...state, results: payload };
    case "SET_ADD_TASKBAR_INDEX":
      return { ...state, addtaskbarIndex: payload };
    default:
      return state;
  }
};
export default uiReducer;
