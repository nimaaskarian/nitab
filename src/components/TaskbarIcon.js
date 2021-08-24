import React from "react";
import "../css/TaskbarIcon.css";

import defaultCommands from "../js/commands";
export default ({
  icon,
  url,
  isBlank,
  color,
  onDblClick,
  bgColor,
  index,
  onClick,
}) => {
  const isEmpty = icon === "empty";
  if (isEmpty)
    return (
      <div
        style={{
          backgroundColor: bgColor,
          cursor: "default",
          width: "7px",
          height: "35px",
          display: "inline-block",
        }}
        onClick={onDblClick}
      />
    );
  return (
    <a
      onDoubleClick={onDblClick}
      style={{
        color,
      }}
      target={isBlank ? "_blank" : "_self"}
      className={"taskbar-icon " + icon}
      href={url ? defaultCommands.url(url)() : "#"}
      onClick={(e) => {
        if (!url) {
          e.preventDefault();
          onClick(index);
        }
      }}
    ></a>
  );
};
