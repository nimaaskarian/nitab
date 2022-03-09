import React from "react";
import { connect, useSelector } from "react-redux";
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
import { ClockDiv, ClockWrapperDiv, ClockDateDiv, ClockTimeDiv } from "./style";

const Clock = (props) => {
  const time = useTime();
  const isDateActive = useSelector(({ data }) => data.isDateActive);
  const clockPos = useSelector(({ data }) => data.clockPos);
  const isWeatherActive = useSelector(({ data }) => data.isWeatherActive);

  const clockAlign = useSelector(({ data }) => data.clockAlign);
  const isPersianDate = useSelector(({ data }) => data.persianDate);
  const clockFormat = useSelector(({ data }) => data.clockFormat);
  return (
    <ClockDiv
      onContextMenu={(e) => {
        e.preventDefault();
        toggleIsClock();
      }}
      clockPos={clockPos}
    >
      <ClockWrapperDiv
        style={{
          alignItems: clockAlign,
        }}
      >
        <ClockTimeDiv className="clock-time" onClick={toggleClockFormat}>
          {clockFormat === "12" ? format12h(time) : format24h(time)}
        </ClockTimeDiv>
        {isDateActive ? (
          <ClockDateDiv onClick={togglePersianDate}>
            {new persianDate()
              .toLocale(isPersianDate ? "fa" : "en")
              .toCalendar(isPersianDate ? "persian" : "gregorian")
              .format(isPersianDate ? "dddd D MMMM" : "dddd, MMMM D")}
          </ClockDateDiv>
        ) : null}
        {isWeatherActive ? <Weather /> : null}
      </ClockWrapperDiv>
    </ClockDiv>
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
