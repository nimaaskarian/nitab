import { openWeather } from "apis";
import localforage from "localforage";
import types from "store/types";

export function addCommand(name, args, icon, color) {
  return {
    type: types.ADD_COMMAND,
    payload: { name, args, icon, color },
  };
}
export function setIsForegoundAuto(isFgAuto) {
  return { type: types.SET_ISFOREGROUND_AUTO, payload: isFgAuto };
}
export function clearCommands() {
  return {
    type: types.CLEAR_COMMANDS,
  };
}

export function toggleClockEnabled(isClock) {
  return { type: types.TOGGLE_CLOCK_ENABLED, payload: isClock };
}
export function toggleParallaxEnabled(payload) {
  return { type: types.TOGGLE_PARALLAX_ENABLED, payload };
}
export function setParallaxFactor(index, parallaxFactor) {
  return {
    type: types.SET_PARALLAX_FACTOR,
    payload: { index, parallaxFactor },
  };
}
export function deleteCommand(name) {
  return {
    type: types.DELETE_COMMAND,
    payload: name,
  };
}
export function addToCommand(name, args) {
  return {
    type: types.ADD_TO_COMMAND,
    payload: { name, args },
  };
}
export function removeFromCommand(name, indexs) {
  return {
    type: types.REMOVE_FROM_COMMAND,
    payload: { name, indexs },
  };
}
export function setClockPosition(position) {
  return {
    type: types.SET_CLOCK_POSITION,
    payload: position,
  };
}
export function setClockAlign(align) {
  return {
    type: types.SET_CLOCK_ALIGN,
    payload: align,
  };
}
export function toggleEnterOpensNewtab() {
  return {
    type: types.TOGGLE_ENTER_OPENS_NEWTAB,
  };
}
export function setFont(font) {
  return {
    type: types.SET_FONT,
    payload: font,
  };
}
export function setIndentifier(iden) {
  return {
    type: types.SET_IDENTIFIER,
    payload: iden,
  };
}
export function addTodo(todo) {
  return {
    type: types.ADD_TODO,
    payload: todo,
  };
}
export function removeTodo(index) {
  return {
    type: types.REMOVE_TODO,
    payload: index,
  };
}
export function importData(data) {
  return {
    type: types.IMPORT_DATA,
    payload: data,
  };
}

export function toggleTaskbarMagnify() {
  return {
    type: types.TOGGLE_TASKBAR_MAGNIFY,
  };
}
export function toggleDateIsPersian() {
  return {
    type: types.TOGGLE_DATE_ISPERSIAN,
  };
}

export function toggleClockFormat() {
  return {
    type: types.TOGGLE_CLOCK_FORMAT,
  };
}
export function setCurrentBackground(input) {
  if (input === "random") {
    return (dispatch, getState) => {
      const max = getState().data.backgrounds.length - 1;
      const last = getState().data.theme.currentBackground;
      let random;
      do {
        random = Math.round(Math.random() * max);
      } while (last === random);
      dispatch({
        type: types.SET_CURRENT_BACKGROUND,
        payload: random,
      });
    };
  }
  return {
    type: types.SET_CURRENT_BACKGROUND,
    payload: input,
  };
}
export function toggleIsBackgroundRandom() {
  return {
    type: types.TOGGLE_IS_BACKGROUND_RANDOM,
  };
}
export function addBackground(background) {
  return (dispatch, getState) => {
    const backgroundsLength = getState().data.backgrounds.length;

    dispatch({
      type: types.ADD_BACKGROUND,
      payload: background,
    });
    dispatch(setCurrentBackground(backgroundsLength));
  };
}
export function deleteBackground(index) {
  return (dispatch, getState) => {
    try {
      const { backgrounds, currentBackground } = getState().data;
      const backgroundToDelete = backgrounds[currentBackground];
      localforage.removeItem(backgroundToDelete.id);
    } catch (error) {}

    dispatch({
      type: types.DELETE_BACKGROUND,
      payload: index,
    });
  };
}
export function setBlur(index, blur) {
  return {
    type: types.SET_BLUR,
    payload: { index, blur },
  };
}
export function setBrightness(index, brightness) {
  return {
    type: types.SET_BRIGHTNESS,
    payload: { index, brightness },
  };
}
export function toggleTodoCompleted(index) {
  return {
    type: types.TOGGLE_TODO_COMPLETED,
    payload: index,
  };
}
export function setForeground(color) {
  return {
    type: types.SET_FOREGROUND,
    payload: color,
  };
}
export function circleSearchMode() {
  return {
    type: types.CIRCLE_SEARCHMODE,
  };
}
export function addTaskbarIcon(icon) {
  return {
    type: types.ADD_TASKBAR_ICON,
    payload: icon,
  };
}
export function deleteTaskbarIcon(index) {
  return {
    type: types.DELETE_TASKBAR_ICON,
    payload: index,
  };
}
export function editTaskbarIcon(index, icon) {
  return {
    type: types.EDIT_TASKBAR_ICON,
    payload: { index, icon },
  };
}
export function resetStorage() {
  return {
    type: types.RESET_STORAGE,
  };
}
export function exportData() {
  return (dispatch, getState) => {
    const data = getState().data;
    const type = "text/json";
    const date = new Date();
    const filename = `exported-data_${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.json`;
    var file = new Blob([JSON.stringify(data)], { type });

    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };
}
export function toggleDateEnabled() {
  return { type: types.TOGGLE_DATE_ENABLED };
}
export function toggleWeatherEnabled() {
  return { type: types.TOGGLE_WEATHER_ENABLED };
}
export function setWeatherData(q) {
  const type = types.SET_WEATHER_DATA;
  return async (dispatch, getState) => {
    const result = getState().data.weatherData;
    if (!result) {
      dispatch({ type, payload: { ...result } });
      return;
    }
    if (result.time && result.data)
      if (result.data.name === q || q !== "Automatic")
        if (Date.now() - result.time <= 3600 * 1000) {
          dispatch({ type, payload: { ...result } });
          return;
        }
    dispatch({ type, payload: {} });
    //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    if (q === "Automatic") {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lon } }) => {
          dispatchData({ lat, lon });
        }
      );
    } else {
      dispatchData({ q });
    }

    async function dispatchData(params) {
      const { data } = await openWeather.get("/weather", {
        params,
      });

      dispatch({ type, payload: { data, time: new Date().getTime() } });
    }
  };
}
export function setWeatherCity(q) {
  return { type: types.SET_WEATHER_CITY, payload: q };
}
export function setUnsplashCollections(un) {
  return { type: types.SET_UNSPLASH_COLLECTIONS, payload: un };
}
export function toggleSuggestCommandsEnabled() {
  return { type: types.TOGGLE_SUGGEST_COMMANDS_ENABLED };
}
export function setSuggestCommandsCount(count) {
  return { type: types.SET_SUGGEST_COMMANDS_COUNT, payload: count };
}
