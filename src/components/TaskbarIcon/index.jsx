import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteTaskbarIcon, setCurrentDragging } from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { TaskbarIconElement } from "./style";
import { useDrag } from "react-dnd";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "taskbar-icon",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    if (isDragging) dispatch(setCurrentDragging(props.index));
  }, [isDragging]);

  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );
  const { r, g, b, a } = props.color;
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <div ref={drag}>
      <TaskbarIconElement
        ref={ref}
        onDoubleClick={() => dispatch(deleteTaskbarIcon(props.index))}
        color={`rgba(${r},${g},${b},${a})`}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        target={enterOpensNewtab ? "_self" : "_blank"}
        className={props.icon}
        href={props.url ? defaultCommands.url.function(props.url)() : "#"}
        // onClick={(e) => {
        //   if (!url) {
        //     e.preventDefault();
        //     dispatch(setAddTaskbarIndex(index));
        //   }
        // }}
        rel="noreferrer"
      ></TaskbarIconElement>
    </div>
  );
});
export default TaskbarIcon;
