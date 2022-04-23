import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import localforage from "localforage";

import useParallax from "hooks/useParallax";
import { StyledBackground } from "./style";
const Background = ({ isTerminal }) => {
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
  const [pictureBlob, setPictureBlob] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);

  useEffect(() => {
    if (backgrounds[currentBackground]) {
      (async () => {
        const { id, video } = backgrounds[currentBackground];

        if (id || video) {
          const getItemFallback = (blob) => {
            if (!blob)
              return localforage.getItem(id || video).then(getItemFallback);
            const url = window.URL.createObjectURL(blob);
            if (id) setPictureBlob(`url('${url}')`);
            if (video) setVideoBlob(url);
            else setVideoBlob(null);
          };
          localforage.getItem(id).then(getItemFallback);
        }
      })();
    }
  }, [backgrounds, currentBackground]);
  return (
    <StyledBackground
      parallax={parallax}
      scale={parallaxEnabled ? 1 + parallaxFactor / 100 : 1}
      background={backgrounds[currentBackground].cssValue || pictureBlob}
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
    >
      {videoBlob ? (
        <video muted autoPlay loop src={videoBlob} type="video/*" />
      ) : null}
    </StyledBackground>
  );
};

export default Background;
