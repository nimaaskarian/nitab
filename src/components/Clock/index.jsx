import React from "react";
import { useDispatch, useSelector } from "react-redux";
import persianDate from "persian-date";
import { format12h, format24h } from "services/formatTime";
import Weather from "components/Weather";
import { toggleDateIsPersian, toggleClockFormat } from "store/actions";
import useTime from "hooks/useTime";

import "./style.css";
import { StyledClock, ClockDate, ClockTime } from "./style";

const Clock = () => {
  const time = useTime();

  const dateEnabled = useSelector(({ data }) => data.date.enabled);
  const weatherEnabled = useSelector(({ data }) => data.weather.enabled);
  const { position, align, format24, enabled } = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].clock
  );

  const isDatePersian = useSelector(({ data }) => data.date.isPersian);

  const dispatch = useDispatch();

  return (
    <StyledClock position={position} align={align}>
      {enabled ? (
        <ClockTime onClick={() => dispatch(toggleClockFormat())}>
          {format24 ? format24h(time) : format12h(time)}
        </ClockTime>
      ) : null}

      {dateEnabled ? (
        <ClockDate onClick={() => dispatch(toggleDateIsPersian())}>
          {new persianDate()
            .toLocale(isDatePersian ? "fa" : "en")
            .toCalendar(isDatePersian ? "persian" : "gregorian")
            .format(isDatePersian ? "dddd D MMMM" : "dddd, MMMM D")}
        </ClockDate>
      ) : null}
      {weatherEnabled ? <Weather /> : null}
    </StyledClock>
  );
};

export default Clock;
