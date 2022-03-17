import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteTaskbarIcon } from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { TaskbarIconElement } from "./style";

const TaskbarIcon = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );
  const { r, g, b, a } = props.color;
  console.log(props.icon);
  console.log(props.marginLeft);
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
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
  );
});
export default TaskbarIcon;
