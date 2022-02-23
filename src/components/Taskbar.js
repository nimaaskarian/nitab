import React from "react";
import { useSelector } from "react-redux";

import TaskbarIcon from "./TaskbarIcon";

const Taskbar = () => {
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const taskbarIcons = useSelector(({ data }) => data.taskbarIcons);
  const gradient = useSelector(({ data }) => data.gradient);
  const magnify = useSelector(({ data }) => data.magnify);
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
  if(!taskbarIcons.length) return null
  return (
    <div
      className={`taskbar-element ${gradient ? "" : "no-gradient"}`}
      onMouseEnter={onTaskbarMouseMove}
      onMouseMove={onTaskbarMouseMove}
      onMouseOut={() => {
        document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
          i.style.fontSize = "35px";
        });
      }}
    >
      {taskbarIcons.map((e, i) => {
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
    </div>
  );
};

export default Taskbar;
