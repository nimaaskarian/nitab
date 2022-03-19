import types from "store/types/data";

class Theme {
  constructor() {
    this.unsplashCollections = "9389477,908506,219941";
    this.foreground = { color: "white", isOvr: false };
    this.currentBackground = 0;
    this.font = "FiraCode, IranSans";
    this.isBackgroundRandom = false;
    this.isForegroundAuto = false;
  }
}
const INITIAL_STATE = {
  list: [new Theme()],
  current: 0,
};
function themesReducer(state = INITIAL_STATE, action) {
  const index = state.current;
  const theme = state.list[index];
  switch (action.type) {
    case types.SET_FOREGROUND: {
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          foreground: action.payload,
        }),
      };
    }
    case types.SET_UNSPLASH_COLLECTIONS: {
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          unsplashCollections: action.payload,
        }),
      };
    }
    case types.TOGGLE_IS_BACKGROUND_RANDOM: {
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          isBackgroundRandom: action.payload,
        }),
      };
    }
    case types.SET_FONT: {
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          font: action.payload,
        }),
      };
    }
    case types.SET_CURRENT_BACKGROUND: {
      console.log(action.payload);
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          currentBackground: action.payload,
        }),
      };
    }
    case types.SET_ISFOREGROUND_AUTO: {
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          isForegroundAuto: action.payload,
        }),
      };
    }
    default:
      return state;
  }
}

export default themesReducer;
