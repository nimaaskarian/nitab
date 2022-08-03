import types from "store/types/data";

class Theme {
  constructor() {
    this.unsplashCollections = "9389477,908506,219941";
    this.foreground = { color: "white", isOvr: false };
    this.customCss = "";
    this.currentBackground = 0;
    this.font = "VazirCodeHack";
    this.isBackgroundRandom = false;
    this.isForegroundAuto = false;
    this.clock = {
      position: "center",
      align: "center",
      format24: false,
      enabled: true,
    };
  }
}
const INITIAL_STATE = {
  list: [new Theme()],
  current: 0,
  isRandom: false,
  dark: -1,
  light: -1,
};
function themesReducer(state = INITIAL_STATE, action) {
  const index = state.current;
  const theme = state.list[index];
  switch (action.type) {
    case types.TOGGLE_IS_THEME_RANDOM: {
      return { ...state, isRandom: !state.isRandom };
    }
    case types.ADD_THEME: {
      return { ...state, list: [...state.list, new Theme()] };
    }
    case types.DELETE_THEME: {
      return { ...state, list: state.list.delete(action.payload) };
    }
    case types.SET_CURRENT_THEME: {
      if (!state.list[action.payload]) return state;
      return { ...state, current: action.payload };
    }
    case types.SET_DARK_THEME: {
      if (!state.list[action.payload]) return state;
      return { ...state, dark: action.payload };
    }
    case types.SET_LIGHT_THEME: {
      if (!state.list[action.payload]) return state;
      return { ...state, light: action.payload };
    }
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

    case types.SET_CLOCK_POSITION:
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          clock: { ...theme?.clock, position: action.payload },
        }),
      };
    case types.SET_CLOCK_ALIGN:
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          clock: { ...theme?.clock, align: action.payload },
        }),
      };
    case types.TOGGLE_CLOCK_FORMAT:
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          clock: {
            ...theme?.clock,
            format24: !theme?.clock?.format24 ?? false,
          },
        }),
      };
    case types.TOGGLE_CLOCK_ENABLED:
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          clock: { ...theme?.clock, enabled: !theme?.clock?.enabled ?? true },
        }),
      };
    case types.SET_CUSTOM_CSS:
      return {
        ...state,
        list: state.list.replace(index, {
          ...theme,
          customCss: action.payload,
        }),
      };
    default:
      return state;
  }
}

export default themesReducer;
