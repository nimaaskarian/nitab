import React from "react";

import Clock from "../Clock";
import EditTaskbar from "../EditTaskbar";
import { useSelector } from "react-redux";

const Main = () => {
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);

  if (isTaskbarEdit) return <EditTaskbar />;
  return <Clock />;
};

export default Main;
