import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSideMenuIndex } from "store/actions";
import { StyledTodoCount } from "./style";

const TodoCount = () => {
  const dispatch = useDispatch();
  const [totalCount, completedCount] = useSelector(({ data }) => [
    data.todos.length,
    data.todos.filter((e) => e.completed).length,
  ]);
  if (!totalCount) return null;
  return (
    <StyledTodoCount onClick={() => dispatch(setSideMenuIndex(2))}>
      <i
        className={
          totalCount === completedCount
            ? "fa fa-circle-check"
            : "far fa-circle"
        }
      />
      {completedCount}/{totalCount}
    </StyledTodoCount>
  );
};

export default TodoCount;
