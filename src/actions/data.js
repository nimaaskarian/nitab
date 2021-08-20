import { openWeather } from "../apis";

export function addCommand(name, args) {
  return {
    type: "ADD_COMMAND",
    payload: { name, args },
  };
}
export function deleteCommand(name) {
  return {
    type: "DELETE_COMMAND",
    payload: { name },
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
export function setBackground(bg) {
  return {
    type: "SET_BACKGROUND",
    payload: bg,
  };
}
export function setClockPosition(position) {
  return {
    type: "SET_CLOCK_POSITION",
    payload: position,
  };
}
export function setClockAlign(align) {
  return {
    type: "SET_CLOCK_ALIGN",
    payload: align,
  };
}
export function setAltNewtab(isAltNewtab) {
  return {
    type: "SET_ALT_NEWTAB",
    payload: isAltNewtab,
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
export function importData(data) {
  return {
    type: "IMPORT_DATA",
    payload: data,
  };
}

export function toggleMagnify(isMagnify) {
  return {
    type: "TOGGLE_MAGNIFY",
    payload: isMagnify,
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
export function setIsHistory(isHistory) {
  return {
    type: "SET_ISHISTORY",
    payload: isHistory,
  };
}
export function addTaskbarIcon(iconConfig) {
  return {
    type: "ADD_TASKBAR",
    payload: iconConfig,
  };
}
export function deleteTaskbarIcon(iconConfig) {
  return {
    type: "ADD_TASKBAR",
    payload: iconConfig,
  };
}
export function editTaskbarIcon(iconConfig) {
  return {
    type: "ADD_TASKBAR",
    payload: iconConfig,
  };
}
export function editEmptyTaskbarIcon(iconConfig) {
  return {
    type: "EDIT_EMPTY_TASKBAR",
    payload: iconConfig,
  };
}
export function setWeatherData(weatherData) {
  return (dispatch,getState)=>{
    if(getState().weatherData)
      if(getState().weatherData.time )
  }
  
}