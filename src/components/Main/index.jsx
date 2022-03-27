import React from "react";

import Clock from "../Clock";
import EditTaskbar from "../EditTaskbar";
import { useSelector } from "react-redux";
import ImageDropzone from "components/Dropzone";

const Main = () => {
  const isDragAccept = useSelector(({ ui }) => ui.isDragAccept);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);

  if (isTaskbarEdit) return <EditTaskbar />;
  return <Clock />;
};

export default Main;
