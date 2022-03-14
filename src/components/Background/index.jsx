import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import localforage from "localforage";
import { setForeground } from "store/actions";

import unsplash from "apis/unsplash";
import useParallax from "hooks/useParallax";
import { BackgroundDiv, BackgroundWrapper } from "./style";
import { getImageLightness } from "services/Images";
import isDark from "services/Styles/isdark-min";
const Background = ({ isTerminal }) => {
  const dispatch = useDispatch();
  const parallax = useParallax();
  const currentBackground = useSelector(
    ({ data }) => data.theme.currentBackground
  );

  const parallaxEnabled = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.parallaxEnabled
  );
  const parallaxFactor = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.parallaxFactor
  );

  const backgrounds = useSelector(({ data }) => data.backgrounds);

  const blur = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.blur
  );
  const brightness = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.brightness
  );
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const isForegroundAuto = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.isForegroundAuto
  );
  // const unsplashCollections = useSelector(
  //   ({ data }) => data.unsplashCollections
  // );
  const [background, setBackground] = useState(null);
  useEffect(() => {
    if (backgrounds[currentBackground]) {
      const { id, cssValue } = backgrounds[currentBackground];
      if (id) {
        (async () => {
          const blob = await localforage.getItem(id);
          setBackground(`url('${window.URL.createObjectURL(blob)}')`);
        })();
      }
      if (cssValue) setBackground(cssValue);
    }
  }, [backgrounds, currentBackground]);

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
    // if (background === "unsplash") {
    //   unsplash
    //     .get("/random", {
    //       params: {
    //         collections: unsplashCollections,
    //       },
    //     })
    //     .then(async ({ data }) => {
    //       const blob = await fetch(data.urls.full).then((r) => r.blob());
    //       setBackground(blob);
    //     });
    // }
  }, [background]);

  return (
    <BackgroundWrapper>
      <BackgroundDiv
        parallax={parallax}
        scale={parallaxEnabled ? 1 + parallaxFactor / 100 : 1}
        background={background}
        blur={
          isTaskbarEdit
            ? blur?.setting
            : isTerminal
            ? blur?.terminal
            : blur?.notTerminal
        }
        brightness={
          isTaskbarEdit
            ? brightness?.setting
            : isTerminal
            ? brightness?.terminal
            : brightness?.notTerminal
        }
      />
    </BackgroundWrapper>
  );
};

export default Background;
