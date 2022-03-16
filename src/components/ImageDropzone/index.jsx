import useDidMountEffect from "hooks/useDidMountEffect";
import useImageDrop from "hooks/useImageDrop";
import React from "react";
import { ImageDropzoneContainer } from "./style";
const ImageDropzone = (props) => {
  const { isDragAccept, getRootProps, getInputProps } = useImageDrop();

  useDidMountEffect(() => {
    props.onIsDragAcceptChange(isDragAccept);
  }, [isDragAccept]);

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
