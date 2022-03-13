import React from "react";
import { useDispatch, useSelector } from "react-redux";
import persianDate from "persian-date";
import { format12h, format24h } from "services/Format/time";
import Weather from "components/Weather";
import {
  toggleDateIsPersian,
  toggleClockFormat,
} from "store/actions";
import useTime from "hooks/useTime";

import "./style.css";
import { ClockDiv, ClockDateDiv, ClockTimeDiv } from "./style";

const Clock = () => {
  const time = useTime();

  const dateEnabled = useSelector(({ data }) => data.date.enabled);
  const weatherEnabled = useSelector(({ data }) => data.weather.enabled);

  const position = useSelector(({ data }) => data.clock.position);
  const align = useSelector(({ data }) => data.clock.align);
  const format = useSelector(({ data }) => data.clock.format);

  const isDatePersian = useSelector(({ data }) => data.date.isPersian);

  const dispatch = useDispatch();

  return (
    <ClockDiv position={position} align={align}>
      <ClockTimeDiv onClick={() => dispatch(toggleClockFormat())}>
        {format === "12" ? format12h(time) : format24h(time)}
      </ClockTimeDiv>
      {dateEnabled ? (
        <ClockDateDiv onClick={() => dispatch(toggleDateIsPersian())}>
          {new persianDate()
            .toLocale(isDatePersian ? "fa" : "en")
            .toCalendar(isDatePersian ? "persian" : "gregorian")
            .format(isDatePersian ? "dddd D MMMM" : "dddd, MMMM D")}
        </ClockDateDiv>
      ) : null}
      {weatherEnabled ? <Weather /> : null}
    </ClockDiv>
  );
};

export default Clock;
