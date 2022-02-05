import React, { useRef, useState } from "react";
import "../css/ToggleSwitch.css";
const ToggleSwitch = ({ onChange }) => {
  const [isToggle, setIsToggle] = useState();
  const checkbox = useRef();
  onChange(isToggle);
  return (
    <label className="switch">
      <input
        ref={checkbox}
        type="checkbox"
        checked={isToggle}
        onChange={() => setIsToggle(checkbox.current.checked)}
      />
      <span className="slider round" />
    </label>
  );
};

export default ToggleSwitch;
