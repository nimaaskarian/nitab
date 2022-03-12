import types from "store/types";

const INITIAL_STATE = {
  icons: [],
  magnify: true,
};
export default function taskbarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_TASKBAR_ICON: {
      const iconsCopy = [...state.icons];
      iconsCopy.splice(action.payload.index, 0, action.payload);
      return { ...state, icons: iconsCopy };
    }

    case types.EDIT_TASKBAR_ICON:
      return state.replace(action.payload.index, action.payload);

    case types.EDIT_EMPTY_ICON_TASKBAR:
      return state.before(action.payload.index, action.payload);

    case types.DELETE_TASKBAR_ICON:
      return state.delete(action.payload);

    case types.TOGGLE_TASKBAR_MAGNIFY:
      return { ...state, magnify: action.payload };
    default:
      return state;
  }
}
