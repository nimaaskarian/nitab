/* eslint-disable no-extend-native */

import { combineReducers } from "redux";

import backgroundsReducer from "./app/backgrounds";
import commandsReducer from "./app/commands";
import taskbarReducer from "./app/taskbar";
import todosReducer from "./app/todos";
import terminalReducer from "./app/terminal";
import themeReducer from "./app/theme";
import clockReducer from "./app/clock";

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
      return state;
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
      return state;
  }
}

const appReducer = combineReducers({
  terminal: terminalReducer,
  clock: clockReducer,
  theme: themeReducer,
  date: dateReducer,
  weather: weatherReducer,
  todos: todosReducer,
  commands: commandsReducer,
  backgrounds: backgroundsReducer,
  taskbar: taskbarReducer,
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
