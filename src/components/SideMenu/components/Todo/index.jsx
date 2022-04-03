/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { useDispatch } from "react-redux";
import { toggleTodoCompleted, removeTodo } from "store/actions";
import { DeleteButton, TwoConditionElement } from "../styled";
import {
  TodoButton,
  TodoMessage,
} from "./style";

const Todo = ({ todo, index }) => {
  const dispatch = useDispatch();

  return (
    <TwoConditionElement enabled={todo.completed}>
      <TodoMessage completed={todo.completed}>{todo.message}</TodoMessage>
      <TodoButton
        className={todo.completed ? "fa fa-check-circle" : "far fa-circle"}
        onClick={() => {
          dispatch(toggleTodoCompleted(index));
        }}
      />
      <DeleteButton
        className="fa fa-trash"
        onClick={(e) => {
          dispatch(removeTodo(index));
        }}
      />
    </TwoConditionElement>
  );
};

export default Todo;
