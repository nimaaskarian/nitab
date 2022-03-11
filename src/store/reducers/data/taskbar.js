import types from "store/types";

export default function taskbarReducer(state = [], action) {
  switch (action.type) {
    case types.ADD_TASKBAR: {
      const stateCopy = [...state];
      stateCopy.splice(action.payload.index, 0, action.payload);
      return [stateCopy];
    }

    case types.EDIT_TASKBAR:
      return state.replace(action.payload.index, action.payload);

    case types.EDIT_EMPTY_TASKBAR:
      return state.before(action.payload.index, action.payload);

    case types.DELETE_TASKBAR:
      return state.delete(action.payload);

    case types.TOGGLE_TASKBAR_MAGNIFY:
      return { ...state, magnify: action.payload };
    default:
      return { ...state };
  }
}
