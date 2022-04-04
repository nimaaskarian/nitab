import { Button, ButtonsWrapper, Header } from "../../components/styled";
import TextInput from "../../components/TextInput";
import Todo from "../../components/Todo";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "store/actions";
import { AddTodoForm } from "./style";
import { nanoid } from "nanoid";

const TodoList = () => {
  const todos = useSelector(({ data }) => data.todos);
  const todosWithKeys = useMemo(
    () => todos.map((e) => ({ ...e, key: nanoid() })),
    [todos]
  );
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (message) {
      dispatch(addTodo({ message }));
      setMessage("");
    }
  };

  return (
    <div>
      <Header>Add Todo</Header>
      <AddTodoForm onSubmit={handleSubmit}>
        <TextInput
          onChange={setMessage}
          required
          value={message}
          label="Todo Message"
        />
        <ButtonsWrapper>
          <Button type="submit">Add</Button>
        </ButtonsWrapper>
      </AddTodoForm>
      <Header>Todos</Header>

      {todosWithKeys
        .map((todo, index) => ({ ...todo, index: index }))
        .sort(function (a, b) {
          if (a.completed) {
            if (b.completed) return 0;
            return 1;
          }
          return -1;
        })
        .map((todo) => (
          <Todo key={todo.key} todo={todo} index={todo.index} />
        ))}
    </div>
  );
};

export default TodoList;
