import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import TaskbarIcon from "../TaskbarIcon";
import TaskbarDrop from "../TaskbarDrop";

import { StyledTaskbar } from "./style";
import eventKeyNumber from "services/eventKeyNumber";
const Taskbar = () => {
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
  const icons = useSelector(({ data }) => data.taskbar.icons);

  const renderedIcons = useMemo(() => {
    const reduced = icons.reduce((acc, cur, index) => {
      return acc.concat([
        <TaskbarDrop key={nanoid(10)} index={index} />,
        <TaskbarIcon
          {...cur}
          key={nanoid(10)}
          index={index}
          ref={(el) => (iconsRefs.current[index] = el)}
        />,
      ]);
    }, []);

    return [...reduced, <TaskbarDrop key={nanoid(10)} index={icons.length} />];
  }, [icons]);
  const iconsRefs = useRef([]);

  const magnify = useSelector(({ data }) => data.taskbar.magnify);
  const handleKeydown = (ev) => {
    const keyNumber = eventKeyNumber(ev);
    if ((ev.altKey || ev.ctrlKey) && keyNumber) {
      ev.preventDefault();
      iconsRefs.current[keyNumber - 1].click();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const onTaskbarMouseMove = (e) => {
    if (!sideMenuIndex && magnify)
      iconsRefs.current.forEach((iconRef) => {
        if (!iconRef) return;
        const { left } = iconRef.getBoundingClientRect();
        let distance =
          Math.abs(e.clientX - left - iconRef.offsetWidth / 2) / 30;
        if (distance <= 1) distance = 0.6;

        iconRef.style.fontSize =
          parseInt((35 + 6.5 / distance) * 10) / 10 + "px";
      });
  };
  return (
    <StyledTaskbar
      onMouseEnter={onTaskbarMouseMove}
      onMouseMove={onTaskbarMouseMove}
      onMouseOut={() => {
        iconsRefs.current.forEach((iconRef) => {
          if (!iconRef) return;
          iconRef.style.fontSize = "35px";
        });
      }}
    >
      {renderedIcons}
    </StyledTaskbar>
  );
};

export default Taskbar;
