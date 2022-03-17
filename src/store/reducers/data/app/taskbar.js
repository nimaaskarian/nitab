import types from "store/types";

const INITIAL_STATE = {
  icons: [],
  magnify: true,
};
export default function taskbarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_TASKBAR_ICON:
      return { ...state, icons: [...state.icons, action.payload] };

    case types.EDIT_TASKBAR_ICON:
      return {
        ...state,
        icons: state.icons.replace(action.payload.index, action.payload.icon),
      };

    case types.DELETE_TASKBAR_ICON:
      return {
        ...state,
        icons: state.delete(action.payload),
      };

    case types.TOGGLE_TASKBAR_MAGNIFY:
      return { ...state, magnify: action.payload };
    default:
      return state;
  }
}
