import types from "store/types/data";

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
    case types.TOGGLE_CLOCK_FORMAT:
      return { ...state, format: state.format === "12" ? "24" : "12" };
    case types.TOGGLE_CLOCK_ENABLED:
      return { ...state, enabled: !state.enabled };
    default:
      return state;
  }
}

export default clockReducer;
