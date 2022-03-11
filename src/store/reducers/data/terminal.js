import types from "store/types";
const INITIAL_STATE = {
  searchMode: 1,
  enterOpensNewtab: false,
  identifier: "/",
  suggestCommandsCount: 4,
  suggestCommandsEnabled: true,
};
function terminalReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CIRCLE_SEARCHMODE:
      return {
        ...state,
        searchMode: state.searchMode + 1 > 3 ? 0 : state.searchMode + 1,
      };
    case types.SET_IDENTIFIER:
      return { ...state, identifier: action.payload };
    case types.TOGGLE_ENTER_OPENS_NEWTAB:
      return { ...state, enterOpensNewtab: !state.enterOpensNewtab };

    case types.TOGGLE_SUGGEST_COMMANDS_ENABLED:
      return {
        ...state,
        suggestCommandsEnabled: !state.suggestCommandsEnabled,
      };

    case types.TOGGLE_SUGGEST_COMMANDS_COUNT:
      return { ...state, suggestCommandsCount: action.payload };
    default:
      return { ...state };
  }
}

export default terminalReducer;
