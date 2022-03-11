import types from "store/types";

class Background {
  constructor({ id, cssValue }) {
    if (id) this.id = id;
    if (cssValue) this.cssValue = cssValue;

    this.parallaxFactor = 5;
    this.isParallax = false;
    this.blur = {
      terminal: "0",
      notTerminal: "0",
      setting: "10",
    };
    this.br = {
      terminal: "1",
      notTerminal: "1",
      setting: ".8",
    };
  }
}

export default function backgroundsReducer(state = [], action) {
  switch (action.type) {
    case types.ADD_BACKGROUND:
      return [...state, new Background(action.payload)];

    default:
      return { ...state };
  }
}
