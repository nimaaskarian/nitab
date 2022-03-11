/* eslint-disable no-extend-native */

import { combineReducers } from "redux";

import backgroundsReducer from "./backgrounds";
import commandsReducer from "./commands";
import taskbarReducer from "./taskbar";
import todosReducer from "./todos";

import types from "store/types";

import { storage } from "..";

/* eslint-disable import/no-anonymous-default-export */
Array.prototype.before = function (index, item) {
  return this.flatMap((e, i) => {
    if (i === index) {
      return [item, e];
    } else {
      return [e];
    }
  });
};
Array.prototype.replace = function (index, item) {
  return this.map((e, i) => (i === index ? item : e));
};
Array.prototype.delete = function (index) {
  const output = [...this];
  output.splice(index, 1);
  return output;
};
const CLOCK_INITIAL_STATE = {
  position: "center",
  align: "center",
  format: "24",
  enabled: true,
};
function clockReducer(state = CLOCK_INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_CLOCK_POSITION:
      return { ...state, position: action.payload };
    case types.SET_CLOCK_ALIGN:
      return { ...state, align: action.payload };
    case types.SET_CLOCK_FORMAT:
      return { ...state, format: action.payload };
    case types.TOGGLE_CLOCK_ENABLED:
      return { ...state, enabled: !state.enabled };
    default:
      return { ...state };
  }
}
const WEATHER_INITIAL_STATE = {
  data: {},
  city: "Automatic",
  enabled: true,
};
function weatherReducer(state = WEATHER_INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_WEATHER_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case types.SET_WEATHER_CITY: {
      return {
        ...state,
        city: action.payload,
      };
    }
    case types.TOGGLE_WEATHER_ENABLED:
      return {
        ...state,
        enabled: !state.enabled,
      };
    default:
      break;
  }
}
const DATE_INITIAL_STATE = {
  isPersian: false,
  enabled: true,
};
function dateReducer(state = DATE_INITIAL_STATE, action) {
  switch (action.type) {
    case types.TOGGLE_DATE_ISPERSIAN:
      return { ...state, isPersian: !state.isPersian };
    case types.TOGGLE_DATE_ENABLED:
      return { ...state, enabled: !state.enabled };
    default:
      break;
  }
}
const THEME_INITIAL_STATE = {
  unsplashCollections: "9389477,908506,219941",
  foreground: { color: "white", isOvr: false },

  font: "FiraCode",
  isForegroundAuto: false,
};
function themeReducer(state = THEME_INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_FOREGROUND:
      return { ...state, foreground: action.payload };
    case types.SET_UNSPLASH:
      return { ...state, unsplashCollections: action.payload };

    case types.SET_FONT:
      return { ...state, font: action.payload };

    case types.SET_ISFOREGROUND_AUTO:
      return { ...state, isForegroundAuto: action.payload };
    default:
      break;
  }
}
const appReducer = combineReducers({
  clock: clockReducer,
  theme: themeReducer,
  date: dateReducer,
  weather: weatherReducer,
  todos: todosReducer,
  commands: commandsReducer,
  backgrounds: backgroundsReducer,
  taskbarIcons: taskbarReducer,
});

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case types.IMPORT_DATA:
      return appReducer(action.payload, action);

    case types.RESET_STORAGE:
      storage.removeItem("persist:nitab");
      return appReducer(undefined, action);

    default:
      return appReducer(state, action);
  }
};

export default rootReducer;
