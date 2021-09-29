import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import persianDate from "persian-date";

import Weather from "./Weather";
import "../css/Clock.css";

import { togglePersianDate } from "../actions";

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

  const onClick = () => {
    props.togglePersianDate();
  };
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
      <div className="clock-date" onClick={onClick}>
        {new persianDate()
          .toLocale(props.persianDate ? "fa" : "en")
          .toCalendar(props.persianDate ? "persian" : "gregorian")
          .format(props.persianDate ? "dddd D MMMM" : "dddd, MMMM D")}
      </div>
      <Weather />
    </div>
  );
};
const mapStateToProp = (state) => {
  return {
    clockPos: state.data.clockPos,
    clockAlign: state.data.clockAlign,
    persianDate: state.data.persianDate,
  };
};
export default connect(mapStateToProp, { togglePersianDate })(Clock);
