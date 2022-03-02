import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { setForeground } from "store/actions";

import unsplash from "apis/unsplash";
import useParallax from "hooks/useParallax";
import { BackgroundDiv, BackgroundWrapperDiv } from "./style";
import { getImageLightness, setBackground } from "services/Images";
import isDark from "services/Styles/isdark-min";
const Background = ({ isTerminal }) => {
  const dispatch = useDispatch();
  const parallax = useParallax();
  const background = useSelector(({ ui }) => ui.background);
  const isParallax = useSelector(({ data }) => data.isParallax);
  const parallaxFactor = useSelector(({ data }) => data.parallaxFactor);
  const blur = useSelector(({ data }) => data.blur);
  const brightness = useSelector(({ data }) => data.brightness);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const gradient = useSelector(({ data }) => data.gradient);
  const isForegroundAuto = useSelector(({ data }) => data.isForegroundAuto);
  const unsplashCollections = useSelector(
    ({ data }) => data.unsplashCollections
  );
  useEffect(() => {
    if (background && isForegroundAuto) {
      getImageLightness(
        background.replace(/^url\('|^url\("/g, "").replace(/"\)|'\)/g, ""),
        (br) => {
          if (br !== null)
            dispatch(
              setForeground(
                `rgb(${br < 127.5 ? 255 : 0},${br < 127.5 ? 255 : 0},${
                  br < 127.5 ? 255 : 0
                })`
              )
            );
          else
            dispatch(
              setForeground(
                `rgb(${isDark(background) ? 255 : 0},${
                  isDark(background) ? 255 : 0
                },${isDark(background) ? 255 : 0})`
              )
            );
        }
      );
    }
  }, [background, isForegroundAuto]);
  useEffect(() => {
    if (background === "unsplash") {
      unsplash
        .get("/random", {
          params: {
            collections: unsplashCollections,
          },
        })
        .then(async ({ data }) => {
          const blob = await fetch(data.urls.full).then((r) => r.blob());
          setBackground(blob);
        });
    }
  }, [background]);

  return (
    <BackgroundWrapperDiv>
      <BackgroundDiv
        parallax={parallax}
        scale={isParallax ? 1 + parallaxFactor / 100 : 1}
        background={background}
        blur={
          isTaskbarEdit
            ? blur.setting
            : isTerminal
            ? blur.terminal
            : blur.notTerminal
        }
        brightness={
          isTaskbarEdit
            ? brightness.setting
            : isTerminal
            ? brightness.terminal
            : brightness.notTerminal
        }
        // className={`${isTerminal ? "isTerminal" : ""} ${
        //   gradient ? "" : "no-gradient"
        // } ${isTaskbarEdit ? "super-blured" : ""}`}
      />
    </BackgroundWrapperDiv>
  );
};

export default Background;
