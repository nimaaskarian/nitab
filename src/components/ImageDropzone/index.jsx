import React from "react";
import { ImageDropzoneContainer } from "./style";
const ImageDropzone = ({ getRootProps, getInputProps }) => {
  return (
    <ImageDropzoneContainer
      {...getRootProps()}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input {...getInputProps()} />
    </ImageDropzoneContainer>
  );
};

export default ImageDropzone;
