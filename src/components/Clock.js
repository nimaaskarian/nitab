import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import persianDate from "persian-date";

import Weather from "./Weather";
import "../css/Clock.css";

import { togglePersianDate, toggleClockFormat } from "../actions";

const Clock = (props) => {
  function format12h(date) {
    const hours = date.getHours() % 12 ? date.getHours() % 12 : 12;
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  }
  const format24h = (date) => {
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
  };
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
      <div className="clock-time" onClick={props.toggleClockFormat}>
        {props.clockFormat === "12" ? format12h(time) : format24h(time)}
      </div>
      <div className="clock-date" onClick={props.togglePersianDate}>
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
    clockFormat: state.data.clockFormat,
  };
};
export default connect(mapStateToProp, {
  togglePersianDate,
  toggleClockFormat,
})(Clock);
