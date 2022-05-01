import useAudioDevices from "hooks/useAudioDevices";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StyledVisualization } from "./style";
const bufferLength = 512;

const Visualizer = () => {
  const canvasRef = useRef();
  const dataArray = useAudioDevices(bufferLength);
  const { color } = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );
  return (
    <StyledVisualization>
      {[...dataArray].map((singleData, index) => {
        return (
          <StyledVisualization.Bar
            key={`${index}-${singleData}`}
            color={color}
            height={(singleData / 255) * 100}
          />
        );
      })}
    </StyledVisualization>
  );
};

export default Visualizer;
