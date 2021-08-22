import defaultCommands from "../js/commands";
const INITIAL_STATE = {
  isHistory: 1,
  altNewtab: false,
  taskbarIcons: [
    {
      icon: "fab fa-telegram",
      color: "white",
      url: "webk.telegram.org",
      index: 0,
    },
  ],
  weatherData: {},
  background: null,
  foreground: "white",
  gradient: true,
  magnify: true,
  isParallex: false,
  identifier: "/",
  parallexFactor: 5,
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
      return [e];
    }
  });
};
Array.prototype.replace = function (index, item) {
  return this.map((e, i) => (i === index ? item : e));
};
Array.prototype.delete = function (index) {
  const output = [...this];
  output.splice(index, 1);
  return output;
};
const deleteFromObject = (object, key) => {
  const output = { ...object };
  delete output[key];
  return output;
};

export default (state = INITIAL_STATE, { payload, type }) => {
 
  switch (type) {
    case "ADD_COMMAND":
      return {
        ...state,
        commands: { ...state.commands, [payload.name]: payload.args },
      };
    case "DELETE_COMMAND": {
      return {
        ...state,
        commands: deleteFromObject(state.commands, payload),
      };
    }

    case "REMOVE_FROM_COMMAND":
      return {
        ...state,
        commands: state.commands[payload.name].filter(
          (e, i) => !payload.indexs.includes(i)
        ),
      };
    case "ADD_TO_COMMAND":
      return {
        ...state,
        commands: {
          ...state.commands,
          [payload.name]: [...state.commands[payload.name], ...payload.args],
        },
      };
    case "ADD_TASKBAR":
      return { ...state, taskbarIcons: [...state.taskbarIcons, payload] };

    case "EDIT_TASKBAR": {
      return {
        ...state,
        taskbarIcons: state.taskbarIcons.replace(payload.index, payload),
      };
    }
    case "DELETE_TASKBAR":
      return { ...state, taskbarIcons: state.taskbarIcons.delete(payload) };

    case "EDIT_EMPTY_TASKBAR": {
      return {
        ...state,
        taskbarIcons: state.taskbarIcons.before(payload.index, payload),
      };
    }
    case "SET_WEATHER_DATA": {
     
      return {
        ...state,
        weatherData: payload,
      };
    }
    case "RESET_STORAGE":
      return { ...INITIAL_STATE };
    case "ADD_ISHISTORY":
      return {
        ...state,
        isHistory: state.isHistory + 1 > 2 ? 0 : state.isHistory + 1,
      };
    case "SET_IDENTIFIER":
      return { ...state, identifier: payload };
    case "IMPORT_DATA":
     
      break;
    case "SET_BACKGROUND":{
     
      return { ...state, background: payload };

    }

    default:
      return { ...state };
  }
};
