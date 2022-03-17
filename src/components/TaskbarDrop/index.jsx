import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { changeTaskbarIconIndex } from "store/actions";

const TaskbarDrop = ({ index }) => {
  const currentDragging = useSelector(({ ui }) => ui.currentDragging);
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "taskbar-icon",
      drop: () => {
        dispatch(changeTaskbarIconIndex(currentDragging, index));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, currentDragging]
  );
  return <div style={{ width: "8px" }} ref={drop}></div>;
};

export default TaskbarDrop;
