import Alert from "components/Alert";
import React from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addBlobAsBackground } from "services/Images";
import { setTerm } from "store/actions";
import { ImageDropzoneContainer } from "./style";
const Dropzone = ({ setDragMessage }) => {
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);

  const alert = useAlert();
  const imageRegexp = new RegExp("image/.*");
  const videoRegexp = new RegExp("video/.*");

  const dispatch = useDispatch();
  const isTaskbarDragging = useSelector(({ ui }) => ui.currentDragging !== -1);
  const handleVideo = (file) => {
    alert.show(
      <Alert>{file.name} has been set as your background video</Alert>
    );
    const videoBlob = new Blob([file], { type: "image/*" });
    addBlobAsBackground(videoBlob, null, "video");
  };
  const handleImage = (file) => {
    alert.show(
      <Alert>{file.name} has been set as your background picture</Alert>
    );
    const bgBlob = new Blob([file], { type: "image/*" });
    addBlobAsBackground(bgBlob);
  };
  const handleDrag = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    let imagesLength = 0,
      textsLength = 0;

    [...ev.dataTransfer.items].forEach((item) => {
      if (imageRegexp.test(item.type)) {
        imagesLength++;
      }
      if (item.kind === "string") {
        textsLength++;
      }
    });

    if (imagesLength) {
      return setDragMessage(
        `Drop to add Background${imagesLength !== 1 ? "s" : ""}`
      );
    }
    if (textsLength) {
      return setDragMessage(`Drop to copy text${textsLength !== 1 ? "s" : ""}`);
    }
  };
  const handleDrop = (ev) => {
    setDragMessage("");
    ev.preventDefault();
    [...ev.dataTransfer.items].forEach((item, index) => {
      const currentFile = ev.dataTransfer.files[index];
      const { type } = item;
      if (imageRegexp.test(type)) handleImage(currentFile);
      if (videoRegexp.test(type)) handleVideo(currentFile);
    });

    [...ev.dataTransfer.items].forEach((item) => {
      if (item.kind === "string") {
        item.getAsString((e) => dispatch(setTerm(e)));
      }
    });
  };
  if (sideMenuIndex || isTaskbarDragging) return null;
  return (
    <ImageDropzoneContainer
      onDragLeave={() => setDragMessage("")}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    />
  );
};

export default Dropzone;
