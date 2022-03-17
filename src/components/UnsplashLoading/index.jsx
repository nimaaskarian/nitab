import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoadingWrapper } from "./style";

const UnsplashLoading = ({ onLoaded }) => {
  const imageLoaded = useSelector(
    ({ ui }) => Math.round(ui.imageLoaded * 100) / 100
  );

  useEffect(() => {
    if (imageLoaded === 1) {
      onLoaded();
    }
  }, [imageLoaded]);

  return (
    <LoadingWrapper>
      <i className="fa fa-spinner"></i>
      <span>{imageLoaded * 100}%</span>
    </LoadingWrapper>
  );
};

export default UnsplashLoading;
