import React, { useEffect, useState, useRef } from "react";
import "./css/Shortcut.css";

const Shortcut = ({ icon, extra }) => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const shortcut = useRef();
  useEffect(() => {
    window.addEventListener("load", () => {
      setWidth(shortcut.current.clientWidth);
      setHeight(shortcut.current.clientHeight);
    });
  }, []);
  return (
    <div className="shortcut-wrapper">
      <div className="shortcut" ref={shortcut}>
        <i className={"fontawe " + icon}></i>
        <div className="extra">{extra}</div>
      </div>
    </div>
  );
};
export default Shortcut;
