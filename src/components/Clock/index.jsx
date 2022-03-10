import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { ClockDiv, ClockDateDiv, ClockTimeDiv } from "./style";

const Clock = () => {
  const time = useTime();
  const isDateActive = useSelector(({ data }) => data.isDateActive);
  const clockPos = useSelector(({ data }) => data.clockPos);
  const isWeatherActive = useSelector(({ data }) => data.isWeatherActive);

  const clockAlign = useSelector(({ data }) => data.clockAlign);
  const isPersianDate = useSelector(({ data }) => data.persianDate);
  const clockFormat = useSelector(({ data }) => data.clockFormat);

  const dispatch = useDispatch();

  return (
    <ClockDiv
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(toggleIsClock());
      }}
      clockPos={clockPos}
      clockAlign={clockAlign}
    >
      <ClockTimeDiv onClick={() => dispatch(toggleClockFormat())}>
        {clockFormat === "12" ? format12h(time) : format24h(time)}
      </ClockTimeDiv>
      {isDateActive ? (
        <ClockDateDiv onClick={() => dispatch(togglePersianDate())}>
          {new persianDate()
            .toLocale(isPersianDate ? "fa" : "en")
            .toCalendar(isPersianDate ? "persian" : "gregorian")
            .format(isPersianDate ? "dddd D MMMM" : "dddd, MMMM D")}
        </ClockDateDiv>
      ) : null}
      {isWeatherActive ? <Weather /> : null}
    </ClockDiv>
  );
};

export default Clock;
