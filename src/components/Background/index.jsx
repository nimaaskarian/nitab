import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import localforage from "localforage";
import { setForeground } from "store/actions";

import useParallax from "hooks/useParallax";
import { StyledBackground } from "./style";
import { getImageLightness } from "services/Images";
import isDark from "services/isdark.min";
const Background = ({ isTerminal }) => {
  const dispatch = useDispatch();
  const parallax = useParallax();
  const currentBackground = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].currentBackground
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
  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
  const isForegroundAuto = useSelector(
    ({ data }) => data.backgrounds[currentBackground]?.isForegroundAuto
  );
  const [background, setBackground] = useState(null);

  useEffect(() => {
    if (backgrounds[currentBackground]) {
      (async () => {
        const { id } = backgrounds[currentBackground];
        if (id) {
          const getItemFallback = (blob) => {
            if (!blob) return localforage.getItem(id).then(getItemFallback);
            setBackground(`url('${window.URL.createObjectURL(blob)}')`);
          };
          localforage.getItem(id).then(getItemFallback);
        }
      })();
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

  return (
    <StyledBackground
      parallax={parallax}
      scale={parallaxEnabled ? 1 + parallaxFactor / 100 : 1}
      background={backgrounds[currentBackground].cssValue || background}
      blur={
        sideMenuIndex
          ? blur?.setting
          : isTerminal
          ? blur?.terminal
          : blur?.notTerminal
      }
      brightness={
        sideMenuIndex
          ? brightness?.setting
          : isTerminal
          ? brightness?.terminal
          : brightness?.notTerminal
      }
    />
  );
};

export default Background;
