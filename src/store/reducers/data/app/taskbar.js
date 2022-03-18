import types from "store/types/types";

const INITIAL_STATE = {
  icons: [],
  magnify: true,
};
export default function taskbarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_TASKBAR_ICON: {
      const { index, icon } = action.payload;
      console.log(index);
      if (index !== undefined) {
        const iconsCopy = [...state.icons];
        iconsCopy.splice(index, 0, icon);
        console.log(index);
        return { ...state, icons: iconsCopy };
      }
      return { ...state, icons: [...state.icons, icon] };
    }
    case types.CHANGE_TASKBAR_ICON_INDEX: {
      const [prevIndex, newIndex] = action.payload;
      const icon = state.icons[prevIndex];
      const iconsCopy = [...state.icons];
      iconsCopy.splice(prevIndex, 1);
      iconsCopy.splice(newIndex, 0, icon);
      return { ...state, icons: iconsCopy };
    }
    case types.EDIT_TASKBAR_ICON:
      return {
        ...state,
        icons: state.icons.replace(action.payload.index, action.payload.icon),
      };

    case types.DELETE_TASKBAR_ICON:
      return {
        ...state,
        icons: state.icons.delete(action.payload),
      };
    case types.RESET_TASKBAR_ICONS:
      return {
        ...state,
        icons: INITIAL_STATE.icons,
      };
    case types.TOGGLE_TASKBAR_MAGNIFY:
      return { ...state, magnify: !state.magnify };
    default:
      return state;
  }
}
