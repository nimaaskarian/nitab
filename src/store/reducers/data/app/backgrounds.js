import types from "store/types";

class Background {
  constructor({ id, cssValue }) {
    if (id) this.id = id;
    if (cssValue) this.cssValue = cssValue;

    this.parallaxFactor = 5;
    this.parallaxEnabled = false;
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
const changeIndexProperty = (state, index, props) => {
  const stateCopy = [...state];
  stateCopy.splice(index, 1, { ...stateCopy[index], ...props });
  return stateCopy;
};
export default function backgroundsReducer(
  state = [new Background("#333")],
  action
) {
  switch (action.type) {
    case types.ADD_BACKGROUND:
      return [...state, new Background(action.payload)];
    case types.DELETE_BACKGROUND:
      return state.delete(action.payload);

    case types.SET_BLUR: {
      const { index, blur } = action.payload;
      return changeIndexProperty(state, index, { blur });
    }

    case types.SET_BRIGHTNESS: {
      const { index, brightness } = action.payload;
      return changeIndexProperty(state, index, { brightness });
    }
    case types.TOGGLE_PARALLAX_ENABLED: {
      console.log(action.payload, state);
      return changeIndexProperty(state, action.payload, {
        parallaxEnabled: !state[action.payload].parallaxEnabled,
      });
    }
    case types.SET_PARALLAX_FACTOR: {
      const { index, parallaxFactor } = action.payload;
      return changeIndexProperty(state, index, { parallaxFactor });
    }
    default:
      return state;
  }
}
