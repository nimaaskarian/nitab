export const data = (state = {}, { payload, type }) => {
  console.log({ ...state })
  if (type === "ADD_COMMAND") return { ...state, [payload.name]: payload.args };
  return { ...state };
};
