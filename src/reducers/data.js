import defaultCommands from "../js/commands";
const INITIAL_STATE = {
  persianDate: true,
  isHistory: 1,
  altNewtab: false,
  taskbarIcons: [],
  clockFormat: "24",
  unsplashCollectons: "9389477,908506,219941",
  weatherCity: "Tehran",
  weatherData: {},
  background: null,
  foreground: "white",
  gradient: true,
  magnify: true,
  isParallax: false,
  identifier: "/",
  parallaxFactor: 5,
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
  todo: [],
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
        commands: {
          ...state.commands,
          [payload.name]: { args: payload.args, icon: payload.icon },
        },
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
    case "SET_WEATHER_CITY": {
      return {
        ...state,
        weatherCity: payload,
      };
    }
    case "RESET_STORAGE":
      return { ...INITIAL_STATE };
    case "ADD_ISHISTORY":
      return {
        ...state,
        isHistory: state.isHistory + 1 > 3 ? 0 : state.isHistory + 1,
      };
    case "SET_IDENTIFIER":
      return { ...state, identifier: payload };
    case "IMPORT_DATA":
      return payload;
    case "SET_FOREGROUND":
      return { ...state, foreground: payload };
    case "SET_UNSPLASH":
      return { ...state, unsplashCollections: payload };
    case "SET_BRIGHTNESS":
      return { ...state, brightness: payload };
    case "SET_BLUR":
      return { ...state, blur: payload };
    case "TOGGLE_MAGNIFY":
      return { ...state, magnify: payload };
    case "TOGGLE_GRADIENT":
      return { ...state, gradient: payload };
    case "SET_CLOCKPOS":
      return { ...state, clockPos: payload };
    case "SET_CLOCKALIGN":
      return { ...state, clockAlign: payload };

    case "ADD_TODO":
      return { ...state, todo: [...state.todo, payload] };
    case "REMOVE_TODO": {
      console.log(type, payload);
      return { ...state, todo: state.todo.delete(payload) };
    }
    case "SET_FONT":
      return { ...state, font: payload };
    case "SET_PARALLAX_FACTOR":
      return { ...state, parallaxFactor: payload };
    case "TOGGLE_PARALLAX":
      return { ...state, isParallax: payload };
    case "CLEAR_COMMANDS":
      return { ...state, commands: INITIAL_STATE.commands };
    case "SET_ISFOREGROUND_AUTO":
      return { ...state, isForegroundAuto: payload };
    case "TOGGLE_ALT_NEWTAB":
      return { ...state, altNewtab: payload };
    case "TOGGLE_PERSIAN_DATE":
      return { ...state, persianDate: payload };
    case "TOGGLE_CLOCK_FORMAT":
      return { ...state, clockFormat: payload };
    default:
      return { ...state };
  }
};
