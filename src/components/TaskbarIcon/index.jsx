import React from "react";
import { useDispatch } from "react-redux";

import { setAddTaskbarIndex, deleteTaskbarIcon } from "store/actions";

import defaultCommands from "services/Commands/defaultCommands";

import { TaskbarIconElement } from "./style";

const TaskbarIcon = (props) => {
  const dispatch = useDispatch();

  const isEmpty = props.icon === "empty";
  if (isEmpty)
    return (
      <div
        style={{
          backgroundColor: props.bgColor,
          cursor: "default",
          width: "7px",
          height: "35px",
          display: "inline-block",
        }}
        onClick={() => dispatch(deleteTaskbarIcon(props.id))}
      />
    );
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <TaskbarIconElement
      onDoubleClick={() => dispatch(deleteTaskbarIcon(props.id))}
      color={props.color}
      target={props.isBlank ? "_blank" : "_self"}
      className={"taskbar-icon " + props.icon}
      href={props.url ? defaultCommands.url(props.url)() : "#"}
      onClick={(e) => {
        if (!props.url) {
          e.preventDefault();
          dispatch(setAddTaskbarIndex(props.index));
        }
      }}
      rel="noreferrer"
    ></TaskbarIconElement>
  );
};
export default TaskbarIcon;
