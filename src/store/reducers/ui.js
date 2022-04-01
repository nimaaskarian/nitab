import types from "store/types/ui";

const INITIAL_STATE = {
  isSideMenu: true,
  timerEditFocus: false,
  term: "",
  tempIcon: "",
  isTerminal: false,
  editTaskbarIndex: -1,
  isFetchingImage: false,
  imageLoaded: 0,
  currentDragging: -1,
};

const uiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_TEMP_ICON:
      return { ...state, tempIcon: action.payload };
    case types.SET_CURRENT_DRAGGING:
      return { ...state, currentDragging: action.payload };
    case types.SET_SIDE_MENU:
      return { ...state, isSideMenu: action.payload };
    case types.SET_TERM:
      return { ...state, term: action.payload };
    case types.SET_IS_FETCHING_IMAGE:
      return { ...state, isFetchingImage: !state.isFetchingImage };
    case types.SET_IMAGE_LOADED:
      return { ...state, imageLoaded: action.payload };
    case types.SET_EDIT_TASKBAR_INDEX:
      return { ...state, editTaskbarIndex: action.payload };
    default:
      return state;
  }
};
export default uiReducer;
