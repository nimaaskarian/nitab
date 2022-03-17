// eslint-disable-next-line jsx-a11y/anchor-has-content

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteTaskbarIcon, setCurrentDragging } from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { TaskbarIconElement, TaskbarIconWrapper } from "./style";
import { useDrag } from "react-dnd";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "taskbar-icon",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  console.log("s", isDragging);
  useEffect(() => {
    console.log("isDragging change", isDragging);
    if (isDragging) {
      if (props.index === -1) {
        const propsCopy = { ...props };
        delete propsCopy.index;
        dispatch(setCurrentDragging(propsCopy));
      } else dispatch(setCurrentDragging(props.index));
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
        marginRight={props.marginRight}
        target={enterOpensNewtab ? "_self" : "_blank"}
        className={props.icon}
        href={props.url ? defaultCommands.url.function(props.url)() : "#"}
        onClick={(e) => {
          if (isTaskbarEdit) {
            e.preventDefault();
          }
        }}
        rel="noreferrer"
      />
    </TaskbarIconWrapper>
  );
});
export default TaskbarIcon;
