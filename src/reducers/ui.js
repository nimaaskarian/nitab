const INITIAL_STATE = {
  isTaskbarEdit: false,
  term: "",
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case "TOGGLE_TASKBAR_EDIT":
      return { ...state, isTaskbarEdit: payload };
    case "SET_TERM":
      return { ...state, term: payload };
    case "SET_AC":
      return { ...state, ac: payload };
    case "SET_BACKGROUND":
      return { ...state, background: payload };
    case "SET_ISTERMINAL":
      return { ...state, isTerminal: payload };
    default:
      return { ...state };
  }
};
