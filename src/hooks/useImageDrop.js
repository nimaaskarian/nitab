import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import setBackground from "services/Images/setBackground";
import { useAlert } from "react-alert";

const useImageDrop = () => {
  const alert = useAlert();
  const onDropAccepted = useCallback((files) => {
    alert.show(
      <div className="alert">
        {files[0].name} has been set as your background picture
      </div>
    );
    const bgBlob = new Blob([files[0]], { type: "image/*" });
    setBackground(bgBlob);
  }, []);
  const onDropRejected = useCallback((files, e) => {
    alert.error(
      <div className="alert">
        {files[0].errors[0].code === "file-invalid-type"
          ? files[0].file.name + "'s file format is not supported"
          : files[0].errors[0].message}
      </div>
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
