import React from "react";

const ImageDropzone = ({getRootProps, getInputProps}) => {
  return (
    <div
      {...getRootProps()}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <input {...getInputProps()} />
    </div>
  );
};

export default ImageDropzone;
