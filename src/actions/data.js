export function addCommand(name, args) {
  return {
    type: "ADD_COMMAND",
    payload: { name, args },
  };
}
export function deleteCommand(name, args) {
  return {
    type: "DELETE_COMMAND",
    payload: { name, args },
  };
}