import types from "store/types";

function todosReducer(state = [], action) {
  switch (action.type) {
    case types.ADD_TODO:
      return [...state, action.payload];
    case types.REMOVE_TODO: {
      return state.delete(action.payload);
    }
    case types.COMPLETE_TODO: {
      const thisTodo = state[action.payload];
      return state.replace(action.payload, { ...thisTodo, completed: true });
    }
    default:
      return { ...state };
  }
}

export default todosReducer;
