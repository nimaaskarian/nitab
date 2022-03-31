import localforage from "localforage";
import types from "store/types/data";

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
      const { current, list } = getState().data.themes;
      const currentTheme = list[current];

      const last = currentTheme.currentBackground;
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
export function addTheme() {
  return {
    type: types.ADD_THEME,
  };
}
export function deleteTheme(index) {
  return {
    type: types.DELETE_THEME,
    payload: index,
  };
}
export function toggleIsThemeRandom() {
  return {
    type: types.TOGGLE_IS_THEME_RANDOM,
  };
}
export function setCurrentTheme(input) {
  if (input === "random") {
    return (dispatch, getState) => {
      const max = getState().data.themes.list.length - 1;
      const last = getState().data.themes.current;
      let random;
      do {
        random = Math.round(Math.random() * max);
      } while (last === random);
      dispatch({
        type: types.SET_CURRENT_THEME,
        payload: random,
      });
    };
  }
  return {
    type: types.SET_CURRENT_THEME,
    payload: input,
  };
}
export function setDarkTheme(index) {
  return {
    type: types.SET_DARK_THEME,
    payload: index,
  };
}
export function setLightTheme(index) {
  return {
    type: types.SET_LIGHT_THEME,
    payload: index,
  };
}
export function toggleIsBackgroundRandom() {
  return {
    type: types.TOGGLE_IS_BACKGROUND_RANDOM,
  };
}
export function addBackground(background, meta) {
  return (dispatch, getState) => {
    const backgroundsLength = getState().data.backgrounds.length;

    dispatch({
      type: types.ADD_BACKGROUND,
      payload: { background, meta },
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
export function addTaskbarIcon(icon, index) {
  return {
    type: types.ADD_TASKBAR_ICON,
    payload: { icon, index },
  };
}
export function resetTaskbarIcons() {
  return {
    type: types.RESET_TASKBAR_ICONS,
  };
}
export function changeTaskbarIconIndex(prevIndex, newIndex) {
  return {
    type: types.CHANGE_TASKBAR_ICON_INDEX,
    payload: [prevIndex, newIndex],
  };
}
export function deleteTaskbarIcon(index) {
  return {
    type: types.DELETE_TASKBAR_ICON,
    payload: index,
  };
}
export function editTaskbarIcon(icon, index) {
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
export function setWeatherData(data) {
  return {
    type: types.SET_WEATHER_DATA,
    payload: data,
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
