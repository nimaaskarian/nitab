import types from "store/types";

const INITIAL_STATE = {
  unsplashCollections: "9389477,908506,219941",
  foreground: { color: "white", isOvr: false },
  currentBackground: 0,
  font: "FiraCode",
  isForegroundAuto: false,
};
function themeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_FOREGROUND:
      return { ...state, foreground: action.payload };
    case types.SET_UNSPLASH_COLLECTIONS:
      return { ...state, unsplashCollections: action.payload };

    case types.SET_FONT:
      return { ...state, font: action.payload };

    case types.SET_ISFOREGROUND_AUTO:
      return { ...state, isForegroundAuto: action.payload };
    default:
      return state;
  }
}

export default themeReducer;
