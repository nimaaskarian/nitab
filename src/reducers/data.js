import defaultCommands from "../js/commands";
const INITIAL_STATE = {
  isHistory: 1,
  altNewtab: false,
  taskbarIcons: [],
  weatherData: null,
  background: null,
  foreground: "white",
  gradient: true,
  magnify: { x: 0, y: 0 },
  parallexFactor: 5,
  isParallex: false,
  identifier: "/",
  commands: defaultCommands,
  font: "Inconsolata",
  clockPos: "center",
  clockAlign: "center",
  blur: {
    terminal: "0",
    notTerminal: "0",
    setting: "10",
  },
  brightness: {
    terminal: "1",
    notTerminal: "1",
    setting: ".8",
  },
  isForegroundAuto: false,
};
Array.prototype.before = function (index, item) {
  return this.flatMap((e, i) => {
    if (i === index) {
      return [item, e];
    } else {
      return [item];
    }
  });
};
Array.prototype.replace = function (index, item) {
  return this.map((e, i) => (i === index ? item : e));
};

export const data = (state = INITIAL_STATE, { payload, type }) => {
  console.log({ ...state });
  switch (type) {
    case "ADD_COMMAND":
      return {
        ...state,
        commands: { ...state.commands, [payload.name]: payload.args },
      };
    case "ADD_TASKBAR":
      return { ...state, taskbarIcons: [...state.taskbarIcons, payload] };
    case "EDIT_TASKBAR": {
      return {
        ...state,
        taskbarIcons: state.taskbarIcons.before(payload.index, payload),
      };
    }
    case "EDIT_EMPTY_TASKBAR": {
      return {
        ...state,
        taskbarIcons: state.taskbarIcons.replace(payload.index, payload),
      };
    }

    default:
      return { ...state };
  }
};
