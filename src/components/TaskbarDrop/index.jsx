import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskbarIcon,
  changeTaskbarIconIndex,
  setEditTaskbarIndex,
  setSideMenuIndex,
} from "store/actions";
import { StyledButton, StyledTaskbarDrop } from "./style";

const TaskbarDrop = ({ index, children, visible, onDrop }) => {
  const currentDragging = useSelector(({ ui }) => ui.currentDragging);
  const [isOver, setIsOver] = useState(false);
  const hasPlus = useSelector(
    ({ data, ui }) => data.taskbar.icons.length === index && ui.sideMenuIndex
  );
  const dispatch = useDispatch();
  const handleDrop = (ev) => {
    setIsOver(false);
    ev.preventDefault();
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
      onDrop={onDrop ? () => onDrop(currentDragging)  : handleDrop}
      onDragOver={handleOver}
      onDragEnd={() => setIsOver(false)}
      onDragLeave={() => setIsOver(false)}
      isOver={isOver}
      hasPlus={hasPlus}
      isFolder={visible}
      visible={visible || currentDragging !== -1}
      index={index}
    >
      {hasPlus ? (
        <StyledButton
          onClick={() => {
            dispatch(setEditTaskbarIndex(-1));
            dispatch(setSideMenuIndex(1));
          }}
          className="fa fa-plus"
        />
      ) : null}
      {children}
    </StyledTaskbarDrop>
  );
};

export default TaskbarDrop;
