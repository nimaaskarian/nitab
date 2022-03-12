import React from "react";
import { useSelector } from "react-redux";

import TaskbarIcon from "../TaskbarIcon";
import { TaskbarDiv } from "./style";
const Taskbar = () => {
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const icons = useSelector(({ data }) => data.taskbar.icons);
  const magnify = useSelector(({ data }) => data.taskbar.magnify);
  const altNewtab = useSelector(({ data }) => data.altNewtab);

  const onTaskbarMouseMove = (e) => {
    if (!isTaskbarEdit && magnify)
      document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
        const { left } = i.getBoundingClientRect();
        let distance = Math.abs(e.clientX - left - i.offsetWidth / 2) / 30;
        if (distance <= 1) distance = 0.6;

        i.style.fontSize = parseInt((35 + 6.5 / distance) * 10) / 10 + "px";
      });
  };
  if (!icons.length) return null;
  return (
    <TaskbarDiv
      onMouseEnter={onTaskbarMouseMove}
      onMouseMove={onTaskbarMouseMove}
      onMouseOut={() => {
        document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
          i.style.fontSize = "35px";
        });
      }}
    >
      {icons.map((e, i) => {
        return (
          <TaskbarIcon
            key={i}
            id={i}
            bgColor={
              e.icon === "empty" && isTaskbarEdit
                ? "rgba(87, 87, 87, 0.36)"
                : null
            }
            index={e.index}
            color={e.color}
            isBlank={!altNewtab}
            icon={e.icon}
            url={isTaskbarEdit ? "" : e.url}
          />
        );
      })}
    </TaskbarDiv>
  );
};

export default Taskbar;
