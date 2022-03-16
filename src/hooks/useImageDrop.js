import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAlert } from "react-alert";
import Alert from "components/Alert";
import { useDispatch } from "react-redux";
import { addBlobAsBackground } from "services/Images";
const useImageDrop = () => {
  const alert = useAlert();
  const onDropAccepted = useCallback((files) => {
    alert.show(
      <Alert>{files[0].name} has been set as your background picture</Alert>
    );
    const bgBlob = new Blob([files[0]], { type: "image/*" });
    addBlobAsBackground(bgBlob);
  }, []);
  const onDropRejected = useCallback((files, e) => {
    alert.error(
      <Alert>
        {files[0].errors[0].code === "file-invalid-type"
          ? files[0].file.name + "'s file format is not supported"
          : files[0].errors[0].message}
      </Alert>
    );
  }, []);
  const { isDragAccept, getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: "image/*",
    multiple: false,
  });
  return { isDragAccept, getRootProps, getInputProps };
};

export default useImageDrop;
