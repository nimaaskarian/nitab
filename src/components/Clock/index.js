import React from "react";
import { connect } from "react-redux";
import persianDate from "persian-date";
import { format12h, format24h } from "services/Format/time";
import Weather from "components/Weather";

import {
  togglePersianDate,
  toggleClockFormat,
  toggleIsClock,
} from "store/actions";
import useTime from "hooks/useTime";

import "./style.css";


const Clock = (props) => {
  const time = useTime();
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        props.toggleIsClock();
      }}
      className="clock foreground-change"
      style={{
        position: props.clockPos !== "center" ? "absolute" : null,
        top: props.clockPos !== "center" ? "20px" : null,
        [props.clockPos]: "5vw",
        transform: props.clockPos !== "center" ? "translateY(50%)" : null,
      }}
    >
      <div
        className="clock-wrapper"
        style={{
          alignItems: props.clockAlign,
        }}
      >
        <div className="clock-time" onClick={props.toggleClockFormat}>
          {props.clockFormat === "12" ? format12h(time) : format24h(time)}
        </div>
        {props.isDateActive ? (
          <div className="clock-date" onClick={props.togglePersianDate}>
            {new persianDate()
              .toLocale(props.persianDate ? "fa" : "en")
              .toCalendar(props.persianDate ? "persian" : "gregorian")
              .format(props.persianDate ? "dddd D MMMM" : "dddd, MMMM D")}
          </div>
        ) : null}
        {props.isWeatherActive ? <Weather /> : null}
      </div>
    </div>
  );
};
const mapStateToProp = (state) => {
  return {
    isDateActive: state.data.isDateActive,
    isWeatherActive: state.data.isWeatherActive,
    clockPos: state.data.clockPos,
    clockAlign: state.data.clockAlign,
    persianDate: state.data.persianDate,
    clockFormat: state.data.clockFormat,
  };
};
export default connect(mapStateToProp, {
  togglePersianDate,
  toggleClockFormat,
  toggleIsClock,
})(Clock);
