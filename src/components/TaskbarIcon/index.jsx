// eslint-disable-next-line jsx-a11y/anchor-has-content

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTaskbarIcon,
  setCurrentDragging,
  setEditTaskbarIndex,
} from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { TaskbarIconElement, TaskbarIconWrapper } from "./style";
import { useDrag } from "react-dnd";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const isBlured = useSelector(
    ({ ui }) =>
      ui.isTaskbarEdit &&
      ui.editTaskbarIndex !== props.index &&
      props.index !== -1
  );
  console.log(isBlured);
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "taskbar-icon",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    if (isDragging) {
      if (props.index === -1 && props.icon) {
        const propsCopy = { ...props };
        delete propsCopy.index;
        dispatch(setCurrentDragging(propsCopy));
      } else dispatch(setCurrentDragging(props.index));
    } else {
      dispatch(setCurrentDragging(-1));
    }
  }, [isDragging]);

  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const { r, g, b, a } = props.color;
  return (
    <TaskbarIconWrapper ref={drag}>
      <TaskbarIconElement
        ref={ref}
        onDoubleClick={() => dispatch(deleteTaskbarIcon(props.index))}
        color={`rgba(${r},${g},${b},${a})`}
        marginLeft={props.marginLeft}
        isBlured={isBlured}
        marginRight={props.marginRight}
        target={enterOpensNewtab ? "_self" : "_blank"}
        className={props.icon}
        href={props.url ? defaultCommands.url.function(props.url)() : "#"}
        onClick={(e) => {
          if (isTaskbarEdit) {
            e.preventDefault();
            dispatch(setEditTaskbarIndex(props.index));
          }
        }}
        rel="noreferrer"
      />
    </TaskbarIconWrapper>
  );
});
export default TaskbarIcon;
