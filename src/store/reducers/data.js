/* eslint-disable no-extend-native */
/* eslint-disable import/no-anonymous-default-export */
const INITIAL_STATE = {
  timerData: {
    hours: null,
    minutes: null,
    seconds: null,
  },
  isDateActive: true,
  isWeatherActive: true,
  timerPausedData: null,
  timerIsPaused: false,
  currentTimer: 0,
  timerFlags: null,
  countingTo: 0,
  persianDate: true,
  isHistory: 1,
  altNewtab: false,
  taskbarIcons: [],
  clockFormat: "24",
  unsplashCollections: "9389477,908506,219941",
  weatherCity: "Tehran",
  weatherData: {},
  background: null,
  foreground: { color: "white", priority: "" },
  gradient: true,
  magnify: true,
  isParallax: false,
  identifier: "/",
  parallaxFactor: 5,
  commands: {
    rgx: {
      args: ["regexr.com%?%google.com/search?q=%input%%20site:regexr.com"],
      color: "#70b0e0",
    },
    w3: {
      args: [
        "w3schools.com%?%google.com/search?q=%input%%20site:w3schools.com",
      ],
      color: "#04aa6d",
    },
    git: {
      args: ["regexr.com%?%google.com/search?q=sss%20site:regexr.com"],
      icon: "fab fa-github",
    },
    sp: {
      args: ["open.spotify.com%?%open.spotify.com/search/%input%"],
      icon: "fab fa-spotify",
      color: "#1db954",
    },
    wa: {
      args: ["web.whatsapp.com"],
      icon: "fab fa-whatsapp",
      color: "#25d366",
    },
    imdb: {
      args: ["imdb.com%?%imdb.com/find?q=%input%"],
      icon: "fab fa-imdb",
      color: "#f5c518",
    },
    stack: {
      args: [
        "stackoverflow.com%?%google.com/search?q=%input%%20site:stackoverflow.com",
      ],
      icon: "fab fa-discord",
      color: "#7772bd",
    },
    yt: {
      args: ["youtube.com%?%youtube.com/results?search_query=%input%"],
      icon: "fab fa-youtube",
      color: "#fe0000",
    },
    r: {
      args: ["reddit.com%?%reddit.com/r/%input%"],
      icon: "fab fa-reddit",
      color: "#ff4500",
    },
    fa: {
      args: ["fontawesome.com/v6%?%fontawesome.com/v6/icons?q=%input%"],
      icon: "fa fa-font-awesome",
      color: "#1c7ed6",
    },
    gate: {
      args: ["192.168.1.1"],
    },
    lh: {
      args: ["localhost:3000%?%localhost:%input%"],
      icon: "fal fa-ethernet",
    },
    des: {
      args: ["desmos.com/calculator"],
      icon: "fal fa-function",
    },
    math: {
      args: ["math.microsoft.com/en%?%symbolab.com/"],
      icon: "fal fa-calculator",
    },
  },
  font: "Inconsolata",
  clockPos: "center",
  clockAlign: "center",
  isClock: true,
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
  acCommands: 4,
  isAcCommands: true,
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
    case "ADD_COMMAND": {
      const { icon, color } = payload;
      return {
        ...state,
        commands: {
          ...state.commands,
          [payload.name]: { args: payload.args, icon, color },
        },
      };
    }
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
      return {
        ...state,
        taskbarIcons: [
          ...state.taskbarIcons.slice(0, payload.index),
          payload,
          ...state.taskbarIcons.slice(payload.index, state.taskbarIcons.length),
        ],
      };

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
    case "SET_CURRENT_TIMER":
      return { ...state, currentTimer: payload };
    case "SET_COUNTING_TO":
      return { ...state, countingTo: payload };
    case "SET_TIMER_DATA":
      return { ...state, timerData: payload };
    case "TOGGLE_TIMER_LOOP":
      return { ...state, timerLoop: !state.timerLoop };
    case "TOGGLE_TIMER_ISPAUSED":
      return { ...state, timerIsPaused: !state.timerIsPaused };
    case "SET_TIMER_ISPAUSED":
      return { ...state, timerIsPaused: payload };
    case "ADD_TIMER_FLAGS":
      return { ...state, timerFlags: state.timerFlags + 1 };
    case "SET_TIMER_FLAGS":
      return { ...state, timerFlags: payload };
    case "TOGGLE_IS_CLOCK":
      return { ...state, isClock: !state.isClock };
    case "TOGGLE_WEATHER_ACTIVE":
      return { ...state, isWeatherActive: !state.isWeatherActive };
    case "TOGGLE_DATE_ACTIVE":
      return { ...state, isDateActive: !state.isDateActive };

    case "TOGGLE_IS_AC_COMMANDS":
      return { ...state, isAcCommands: !state.isAcCommands };

    case "SET_AC_COMMANDS":
      return { ...state, acCommands: payload };
    default:
      return { ...state };
  }
};
