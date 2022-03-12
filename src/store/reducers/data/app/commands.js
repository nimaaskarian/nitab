import types from "store/types";

const INITIAL_STATE = {
  rgx: {
    args: ["regexr.com%?%google.com/search?q=%input%%20site:regexr.com"],
    color: "#70b0e0",
  },
  w3: {
    args: ["w3schools.com%?%google.com/search?q=%input%%20site:w3schools.com"],
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
};
const deleteFromObject = (object, key) => {
  const output = { ...object };
  delete output[key];
  return output;
};

export default function commandsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_COMMAND: {
      const { icon, color } = action.payload;
      return {
        ...state.commands,
        [action.payload.name]: { args: action.payload.args, icon, color },
      };
    }
    case types.DELETE_COMMAND: {
      return {
        ...state,
        commands: deleteFromObject(state.commands, action.payload),
      };
    }

    case types.REMOVE_FROM_COMMAND:
      return {
        ...state,
        commands: state.commands[action.payload.name].filter(
          (e, i) => !action.payload.indexs.includes(i)
        ),
      };
    case types.ADD_TO_COMMAND:
      return {
        ...state,
        commands: {
          ...state.commands,
          [action.payload.name]: [
            ...state.commands[action.payload.name],
            ...action.payload.args,
          ],
        },
      };
    case types.CLEAR_COMMANDS:
      return { ...state, commands: INITIAL_STATE.commands };
    default:
      return state;
  }
}
