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
    default:
      return { ...state };
  }
};
