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
export function setClockPosition(pos) {
  return {
    type: "SET_CLOCK_POSITION",
    payload: pos,
  };
}
export function setClockAlign(al) {
  return {
    type: "SET_CLOCK_ALIGN",
    payload: al,
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