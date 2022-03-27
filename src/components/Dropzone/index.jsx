import Alert from "components/Alert";
import React from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { addBlobAsBackground } from "services/Images";
import { setTerm } from "store/actions";
import { ImageDropzoneContainer } from "./style";
const Dropzone = ({ setDragMessage }) => {
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);

  const alert = useAlert();
  const imageRegexp = new RegExp("image/.*");
  const dispatch = useDispatch();
  const handleImage = (file) => {
    alert.show(
      <Alert>{file.name} has been set as your background picture</Alert>
    );
    const bgBlob = new Blob([file], { type: "image/*" });
    addBlobAsBackground(bgBlob);
  };
  const dragHandle = (ev) => {
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
  const dropHandle = (ev) => {
    setDragMessage("");
    ev.preventDefault();
    [...ev.dataTransfer.items].forEach((item, index) => {
      if (imageRegexp.test(item.type))
        handleImage(ev.dataTransfer.files[index]);
    });

    [...ev.dataTransfer.items].forEach((item) => {
      if (item.kind === "string") {
        item.getAsString((e) => dispatch(setTerm(e)));
      }
    });
  };
  if (isTaskbarEdit) return null;
  return (
    <>
      <ImageDropzoneContainer
        onDragExit={() => setDragMessage("")}
        onDragOver={dragHandle}
        onDrop={dropHandle}
      />
    </>
  );
};

export default Dropzone;
