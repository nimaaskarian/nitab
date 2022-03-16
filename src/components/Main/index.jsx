import React from "react";

import Clock from "../Clock";
import Taskbar from "../Taskbar";
import AddTaskbar from "../AddTaskbar";
import { useSelector } from "react-redux";

const Main = () => {
  const isDragAccept = useSelector(({ ui }) => ui.isDragAccept);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  if (isTaskbarEdit) return <AddTaskbar />;
  if (isDragAccept) return <h1>Drop the image...</h1>;
  return <Clock />;
};

export default Main;
