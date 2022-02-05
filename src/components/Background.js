import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useParallax from "../hooks/useParallax";
import { setForeground } from "../actions";
import { unsplash } from "../apis";
import { isDark, getImageLightness, setBackground } from "../utils";
import { useDispatch } from "react-redux";
const Background = ({ isTerminal }) => {
  const dispatch = useDispatch();
  const parallax = useParallax();
  const background = useSelector(({ ui }) => ui.background);
  const isParallax = useSelector(({ data }) => data.isParallax);
  const blur = useSelector(({ data }) => data.blur);
  const brightness = useSelector(({ data }) => data.brightness);
  const parallaxFactor = useSelector(({ data }) => data.parallaxFactor);
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
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          marginLeft: isParallax ? `${parallax.x * parallaxFactor}vw` : "0",
          marginTop: isParallax ? `${parallax.y * parallaxFactor}vh` : "0",
          transform: isParallax ? `scale(${1 + parallaxFactor / 100})` : null,
          background: background || "#222",
          filter: `blur(${
            isTaskbarEdit
              ? blur.setting
              : isTerminal
              ? blur.terminal
              : blur.notTerminal
          }px) brightness(${
            isTaskbarEdit
              ? brightness.setting
              : isTerminal
              ? brightness.terminal
              : brightness.notTerminal
          })`,
        }}
        className={`background ${isTerminal ? "isTerminal" : ""} ${
          gradient ? "" : "no-gradient"
        } ${isTaskbarEdit ? "super-blured" : ""}`}
      />
    </div>
  );
};

export default Background;
