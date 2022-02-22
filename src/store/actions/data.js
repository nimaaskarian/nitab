import { openWeather } from "apis";

export function addCommand(name, args, icon, color) {
  return {
    type: "ADD_COMMAND",
    payload: { name, args, icon, color },
  };
}
export function setIsForegoundAuto(isFgAuto) {
  return { type: "SET_ISFOREGROUND_AUTO", payload: isFgAuto };
}
export function clearCommands() {
  return {
    type: "CLEAR_COMMANDS",
  };
}

export function setTimerFlags(timerFlags) {
  return { type: "SET_TIMER_FLAGS", payload: timerFlags };
}
export function addTimerFlags() {
  return { type: "ADD_TIMER_FLAGS" };
}
export function toggleTimerIsPaused() {
  return { type: "TOGGLE_TIMER_ISPAUSED" };
}
export function setTimerIsPaused(isPaused) {
  return { type: "SET_TIMER_ISPAUSED", payload: isPaused };
}
export function toggleTimerLoop(loop) {
  return { type: "TOGGLE_TIMER_LOOP", payload: loop };
}
export function setParallaxFactor(factor) {
  return { type: "SET_PARALLAX_FACTOR", payload: factor };
}
export function toggleIsClock(isClock) {
  return { type: "TOGGLE_IS_CLOCK", payload: isClock };
}
export function toggleIsParallax() {
  return (dispatch, getStore) => {
    const prevIsParallax = getStore().data.isParallax;
    dispatch({ type: "TOGGLE_PARALLAX", payload: !prevIsParallax });
  };
}
export function deleteCommand(name) {
  return {
    type: "DELETE_COMMAND",
    payload: name,
  };
}
export function addToCommand(name, args) {
  return {
    type: "ADD_TO_COMMAND",
    payload: { name, args },
  };
}
export function removeFromCommand(name, indexs) {
  return {
    type: "REMOVE_FROM_COMMAND",
    payload: { name, indexs },
  };
}
export function setCurrentTimer(currentTimer) {
  return { type: "SET_CURRENT_TIMER", payload: currentTimer };
}
export function setCountingTo(countingTo) {
  return { type: "SET_COUNTING_TO", payload: countingTo };
}
export function setTimerData(data) {
  return { type: "SET_TIMER_DATA", payload: data };
}
export function setClockPosition(position) {
  return {
    type: "SET_CLOCKPOS",
    payload: position,
  };
}
export function setClockAlign(align) {
  return {
    type: "SET_CLOCKALIGN",
    payload: align,
  };
}
export function toggleAltNewtab() {
  return (dispatch, getStore) => {
    const prevAltNewtab = getStore().data.altNewtab;
    dispatch({ type: "TOGGLE_ALT_NEWTAB", payload: !prevAltNewtab });
  };
}
export function setFont(font) {
  return {
    type: "SET_FONT",
    payload: font,
  };
}
export function setIndentifier(iden) {
  return {
    type: "SET_IDENTIFIER",
    payload: iden,
  };
}
export function addTodo(todo) {
  return {
    type: "ADD_TODO",
    payload: todo,
  };
}
export function removeTodo(index) {
  return {
    type: "REMOVE_TODO",
    payload: index,
  };
}
export function importData() {
  return async (dispatch) => {
    const fileReader = new window.FileReader();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.opacity = "0";
    input.style.position = "absolute";
    input.style.bottom = "0";
    document.body.appendChild(input);
    input.click();
    input.addEventListener("change", () => {
      if (!input.files.length || input.files.length > 1) return;
      fileReader.readAsText(input.files[0]);
      fileReader.onload = ({ target }) => {
        console.log(target);
        dispatch({ type: "IMPORT_DATA", payload: JSON.parse(target.result) });
      };
    });
  };
}

export function toggleMagnify() {
  return (dispatch, getStore) => {
    const prevMagnify = getStore().data.magnify;
    dispatch({
      type: "TOGGLE_MAGNIFY",
      payload: !prevMagnify,
    });
  };
}
export function togglePersianDate() {
  return (dispatch, getStore) => {
    const prevPD = getStore().data.persianDate;
    dispatch({
      type: "TOGGLE_PERSIAN_DATE",
      payload: !prevPD,
    });
  };
}

export function toggleClockFormat() {
  return (dispatch, getStore) => {
    const output = getStore().data.clockFormat === "12" ? "24" : "12";
    dispatch({
      type: "TOGGLE_CLOCK_FORMAT",
      payload: output,
    });
  };
}

export function toggleGradient() {
  return (dispatch, getStore) => {
    const prevGradient = getStore().data.gradient;
    dispatch({
      type: "TOGGLE_GRADIENT",
      payload: !prevGradient,
    });
  };
}
export function setGradient(gradient) {
  return {
    type: "SET_GRADIENT",
    payload: gradient,
  };
}
export function setBlur(blur) {
  return {
    type: "SET_BLUR",
    payload: blur,
  };
}
export function setBrightness(brightness) {
  return {
    type: "SET_BRIGHTNESS",
    payload: brightness,
  };
}
export function setForeground(color) {
  return {
    type: "SET_FOREGROUND",
    payload: color,
  };
}
export function addIsHistory() {
  return {
    type: "ADD_ISHISTORY",
  };
}
export function addTaskbarIcon(iconConfig) {
  return {
    type: "ADD_TASKBAR",
    payload: iconConfig,
  };
}
export function deleteTaskbarIcon(index) {
  return {
    type: "DELETE_TASKBAR",
    payload: index,
  };
}
export function editTaskbarIcon(iconConfig) {
  return {
    type: "EDIT_TASKBAR",
    payload: iconConfig,
  };
}
export function editEmptyTaskbarIcon(iconConfig) {
  return {
    type: "EDIT_EMPTY_TASKBAR",
    payload: iconConfig,
  };
}
export function resetStorage() {
  return {
    type: "RESET_STORAGE",
  };
}
export function exportData() {
  return (dispatch, getState) => {
    const data = getState().data;
    const type = "text/json";
    const filename = "Exported-data.json";
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
export function toggleDateActive() {
  return { type: "TOGGLE_DATE_ACTIVE" };
}
export function toggleWeatherActive() {
  return { type: "TOGGLE_WEATHER_ACTIVE" };
}
export function setWeatherData(q) {
  const type = "SET_WEATHER_DATA";
  return async (dispatch, getState) => {
    const result = getState().data.weatherData;
    if (!result) {
      dispatch({ type, payload: { ...result } });
      return;
    }
    if (result.time && result.data)
      if (result.data.name === q)
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
  return { type: "SET_WEATHER_CITY", payload: q };
}
export function setUnsplash(un) {
  return { type: "SET_UNSPLASH", payload: un };
}
export function toggleIsAcCommands() {
  return { type: "TOGGLE_IS_AC_COMMANDS" };
}
export function setAcCommands(acCommands) {
  return { type: "SET_AC_COMMANDS", payload: acCommands };
}