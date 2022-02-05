import React from "react";
import { useSelector } from "react-redux";
import useParallax from "../hooks/useParallax";

const Background = ({ isTerminal }) => {
  const parallax = useParallax();
  const colorOrImage = useSelector(({ ui }) => ui.background);
  const isParallax = useSelector(({ data }) => data.isParallax);
  const blur = useSelector(({ data }) => data.blur);
  const brightness = useSelector(({ data }) => data.brightness);
  const parallaxFactor = useSelector(({ data }) => data.parallaxFactor);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const gradient = useSelector(({ data }) => data.gradient);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          marginLeft: isParallax ? `${parallax.x * parallaxFactor}vw` : "0",
          marginTop: isParallax ? `${parallax.y * parallaxFactor}vh` : "0",
          transform: isParallax ? `scale(${1 + parallaxFactor / 100})` : null,
          background: colorOrImage || "#222",
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
