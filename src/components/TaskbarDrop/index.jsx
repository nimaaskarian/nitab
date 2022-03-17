import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskbarIcon,
  changeTaskbarIconIndex,
  setCurrentDragging,
} from "store/actions";
import { StyledTaskbarDrop } from "./style";

const TaskbarDrop = ({ index }) => {
  const currentDragging = useSelector(({ ui }) => ui.currentDragging);
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "taskbar-icon",
      drop: () => {
        if (currentDragging === -1) return;
        if (typeof currentDragging === "object") {
          dispatch(addTaskbarIcon(currentDragging, index));
        } else {
          if (![0, 1].includes(index - currentDragging)) {
            let newIndex = 0;
            if (index > currentDragging) newIndex = index - 1;
            else newIndex = index;

            dispatch(changeTaskbarIconIndex(currentDragging, newIndex));
          }
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, currentDragging]
  );
  return (
    <StyledTaskbarDrop
      isOver={isOver}
      visible={currentDragging !== -1}
      ref={drop}
    />
  );
};

export default TaskbarDrop;
