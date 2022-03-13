/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { useDispatch } from "react-redux";
import { toggleTodoCompleted, removeTodo } from "store/actions";
import { TodoButton, TodoMessage, TodoWrapper } from "./style";

const Todo = ({ todo, index }) => {
  const dispatch = useDispatch();

  return (
    <TodoWrapper isRtl={/^[\u0600-\u06FF\s]+/.test(todo.message)}>
      <TodoMessage completed={todo.completed}>{todo.message}</TodoMessage>
      <TodoButton
        className={todo.completed ? "far fa-check-circle" : "far fa-circle"}
        onClick={() => {
          dispatch(toggleTodoCompleted(index));
        }}
      />
      <TodoButton
        className="fa fa-trash"
        color="#f28fad"
        onClick={(e) => {
          dispatch(removeTodo(index));
        }}
      />
    </TodoWrapper>
  );
};

export default Todo;
