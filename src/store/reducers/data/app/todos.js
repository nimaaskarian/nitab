import types from "store/types";

function todosReducer(state = [], action) {
  switch (action.type) {
    case types.ADD_TODO:
      return [...state, action.payload];
    case types.REMOVE_TODO: {
      return state.delete(action.payload);
    }
    case types.TOGGLE_TODO_COMPLETED: {
      const thisTodo = state[action.payload];
      return state.replace(action.payload, {
        ...thisTodo,
        completed: !thisTodo.completed,
      });
    }
    default:
      return state;
  }
}

export default todosReducer;
