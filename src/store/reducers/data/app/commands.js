import types from "store/types/data";

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
    args: ["github.com/%input%"],
    icon: "fab fa-github",
  },
  sp: {
    args: ["open.spotify.com%?%open.spotify.com/search/%input%"],
    icon: "fab fa-spotify",
    color: "#1db954",
  },
  ig: {
    icon: "fab fa-instagram",
    args: ["instagram.com/%input%"],
    color: "#cf2872",
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
    icon: "fab fa-stack-overflow",
    color: "#ee812a",
  },
  dis: {
    args: ["https://discord.com/channels/@me"],
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
    icon: "fa fa-ethernet",
  },
  lh: {
    args: ["localhost:3000%?%localhost:%input%"],
    icon: "fa fa-ethernet",
  },
  des: {
    args: ["desmos.com/calculator"],
  },
  tw: {
    icon: "fab fa-twitter",
    args: ["twitter.com%?%twitter.com/search?q=%input%&src=typed_query&f=top"],
    color: "#0e7fca",
  },

  tr: {
    args: [
      "https://translate.google.com/?sl=en&tl=fa&text=%input%&op=translate",
    ],
    icon: "fa fa-language",
  },
  math: {
    args: ["math.microsoft.com/en%?%symbolab.com/"],
    icon: "fa fa-calculator",
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
      const commandCopy = state[action.payload.name] || {};
      action.payload = Object.fromEntries(
        Object.entries(action.payload).map(([key, value]) => {
          console.log(key, value);
          if (!value || !value.length) return [key, commandCopy[key]];
          return [key, value];
        })
      );
      return {
        ...state,
        [action.payload.name]: { ...commandCopy, ...action.payload },
      };
    }
    case types.DELETE_COMMAND: {
      return deleteFromObject(state, action.payload);
    }

    case types.REMOVE_FROM_COMMAND:
      return {
        ...state,
        ...state[action.payload.name].filter(
          (e, i) => !action.payload.indexs.includes(i)
        ),
      };
    case types.ADD_TO_COMMAND:
      return {
        ...state,
        [action.payload.name]: [
          ...state[action.payload.name],
          ...action.payload.args,
        ],
      };
    case types.CLEAR_COMMANDS:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}
