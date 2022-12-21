// eslint-disable-next-line jsx-a11y/anchor-has-content

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTaskbarIcon,
  setCurrentDragging,
  setEditTaskbarIndex,
  setSideMenuIndex,
} from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { StyledTaskbarIcon, TaskbarIconWrapper } from "./style";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const isBlured = useSelector(
    ({ ui }) =>
      ui.sideMenuIndex &&
      ui.editTaskbarIndex !== props.index &&
      props.index !== -1
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
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
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
        // href={props.url ? defaultCommands.url.function(props.url)() : "#"}
        onClick={(e) => {
          if (sideMenuIndex) {
            dispatch(setSideMenuIndex(1));
            e.preventDefault();
            dispatch(setEditTaskbarIndex(props.index));
          } else {
            console.log(props.url)
            const onSubmit = props.url.function(props.url.args)();
            if (typeof onSubmit === "string") {
              if (enterOpensNewtab) window.open(onSubmit);
              else {
                document.location = onSubmit;
              }
            } else {
              onSubmit(
                enterOpensNewtab,
              );
            }
          }
        }}
        rel="noreferrer"
      />
    </TaskbarIconWrapper>
  );
});
export default TaskbarIcon;
