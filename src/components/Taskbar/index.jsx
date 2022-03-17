import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import TaskbarIcon from "../TaskbarIcon";

import { StyledTaskbar } from "./style";
const Taskbar = () => {
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const icons = useSelector(({ data }) =>
    data.taskbar.icons.map((e) => {
      return { ...e, key: nanoid(10) };
    })
  );
  const iconsRefs = useRef([]);

  const magnify = useSelector(({ data }) => data.taskbar.magnify);
  const handleKeydown = (e) => {
    e.preventDefault();
    if ((e.altKey || e.ctrlKey) && +e.key) {
      iconsRefs.current[+e.key].click();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const onTaskbarMouseMove = useCallback(
    (e) => {
      if (!isTaskbarEdit && magnify)
        iconsRefs.current.forEach((iconRef) => {
          const { left } = iconRef.getBoundingClientRect();
          let distance =
            Math.abs(e.clientX - left - iconRef.offsetWidth / 2) / 30;
          if (distance <= 1) distance = 0.6;

          iconRef.style.fontSize =
            parseInt((35 + 6.5 / distance) * 10) / 10 + "px";
        });
    },
    [iconsRefs, isTaskbarEdit, magnify]
  );

  return (
    <StyledTaskbar
      onMouseEnter={onTaskbarMouseMove}
      onMouseMove={onTaskbarMouseMove}
      onMouseOut={() => {
        iconsRefs.current.forEach((iconRef) => {
          iconRef.style.fontSize = "35px";
        });
      }}
    >
      {icons.map((icon, index) => {
        console.log(icon);
        return (
          <TaskbarIcon
            {...icon}
            key={icon.key}
            index={index}
            ref={(el) => (iconsRefs.current[index] = el)}
          />
        );
      })}
    </StyledTaskbar>
  );
};

export default Taskbar;
