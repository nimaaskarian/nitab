import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoadingWrapper } from "./style";

const UnsplashLoading = ({ onLoaded }) => {
  const loadedPercentage = useSelector(({ ui }) =>
    Math.round(ui.imageLoaded * 100)
  );

  useEffect(() => {
    if (loadedPercentage === 100) {
      onLoaded();
    }
  }, [loadedPercentage]);

  return (
    <LoadingWrapper>
      <i className="fa fa-spinner"></i>
      <span>{loadedPercentage}%</span>
    </LoadingWrapper>
  );
};

export default UnsplashLoading;
