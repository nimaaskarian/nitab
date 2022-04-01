// eslint-disable-next-line jsx-a11y/anchor-has-content

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTaskbarIcon,
  setCurrentDragging,
  setEditTaskbarIndex,
} from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { StyledTaskbarIcon, TaskbarIconWrapper } from "./style";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const isBlured = useSelector(
    ({ ui }) =>
      ui.isSideMenu && ui.editTaskbarIndex !== props.index && props.index !== -1
  );
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
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
  const isSideMenu = useSelector(({ ui }) => ui.isSideMenu);
  const { r, g, b, a } = props.color || {};
  return (
    <TaskbarIconWrapper
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <StyledTaskbarIcon
        ref={ref}
        onDoubleClick={() => dispatch(deleteTaskbarIcon(props.index))}
        color={
          ![null, undefined].includes(r ?? g ?? b)
            ? `rgba(${r},${g},${b},${a})`
            : props.color || null
        }
        marginLeft={props.marginLeft}
        isBlured={isBlured}
        marginRight={props.marginRight}
        target={enterOpensNewtab ? "_blank" : "_self"}
        className={props.icon}
        href={props.url ? defaultCommands.url.function(props.url)() : "#"}
        onClick={(e) => {
          if (isSideMenu) {
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
