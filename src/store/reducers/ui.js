const INITIAL_STATE = {
  isTaskbarEdit: false,
  timerEditFocus: false,
  term: "",
  results: [],
  isTerminal: false,
  editTaskbarIndex: -1,
  isFetchingImage: false,
  imageLoaded: 0,
  currentDragging: -1,
};

const uiReducer = (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case "SET_CURRENT_DRAGGING":
      return { ...state, currentDragging: payload };
    case "TOGGLE_TASKBAR_EDIT":
      return { ...state, isTaskbarEdit: !state.isTaskbarEdit };
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
    case "SET_EDIT_TASKBAR_INDEX":
      return { ...state, editTaskbarIndex: payload };
    default:
      return state;
  }
};
export default uiReducer;
