import useAudioDevices from "hooks/useAudioDevices";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { StyledVisualization } from "./style";
const bufferLength = 256;

const Visualizer = () => {
  const canvasRef = useRef();
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const [dataArray, mediaDevices] = useAudioDevices(
    bufferLength,
    currentDeviceId
  );
 
  const handleSelectChange = (ev) => {
    setCurrentDeviceId(ev.target.value);
  };
  const { color } = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );
  return (
    <div>
      <select onChange={handleSelectChange} value={currentDeviceId}>
        {mediaDevices.map((device, index) => {
          return (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Audio Device #${index}`}
            </option>
          );
        })}
      </select>
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
    </div>
  );
};

export default Visualizer;
