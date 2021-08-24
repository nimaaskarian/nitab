import React, { useState, useEffect } from "react";
import Weather from "./Weather";
import { connect } from "react-redux";
const Clock = (props) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const intervalid = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalid);
    };
  }, []);
  return (
    <div
      style={{
        position: props.clockPos !== "center" ? "absolute" : null,
        top: props.clockPos !== "center" ? "20px" : null,
        [props.clockPos]: "5vw",
        alignItems: props.clockAlign,
      }}
      className="clock foreground-change"
    >
      <div className="clock-time">{`${time.getHours()}:${
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
      }`}</div>
      <div className="clock-date">{new Date().toDateString(time)}</div>
      <Weather />
    </div>
  );
};
const mapStateToProp = (state) => {
  return { clockPos: state.data.clockPos, clockAlign: state.data.clockAlign };
};
export default connect(mapStateToProp)(Clock);
