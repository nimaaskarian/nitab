import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskbarIcon,
  changeTaskbarIconIndex,
  setEditTaskbarIndex,
} from "store/actions";
import { StyledButton, StyledTaskbarDrop } from "./style";

const TaskbarDrop = ({ index, children }) => {
  const currentDragging = useSelector(({ ui }) => ui.currentDragging);
  const [isOver, setIsOver] = useState(false);
  const hasPlus = useSelector(
    ({ data, ui }) => data.taskbar.icons.length === index && ui.isTaskbarEdit
  );
  const dispatch = useDispatch();
  const handleDrop = () => {
    setIsOver(false);

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
  };
  const handleOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOver(true);
  };
  return (
    <StyledTaskbarDrop
      onDrop={handleDrop}
      onDragOver={handleOver}
      onDragEnd={() => setIsOver(false)}
      onDragLeave={() => setIsOver(false)}
      isOver={isOver}
      hasPlus={hasPlus}
      visible={currentDragging !== -1}
      index={index}
    >
      {hasPlus ? (
        <StyledButton
          onClick={() => dispatch(setEditTaskbarIndex(-1))}
          className="fa fa-plus"
        />
      ) : null}
    </StyledTaskbarDrop>
  );
};

export default TaskbarDrop;
