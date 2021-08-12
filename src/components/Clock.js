import React, { useState, useEffect } from "react";
import Weather from "./Weather";
const Clock = ({ style, isDate, weatherData }) => {
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
    <div style={style} className="clock foreground-change">
      <div className="clock-time">{`${time.getHours()}:${
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
      }`}</div>
      <div className="clock-date">{new Date().toDateString(time)}</div>
      <Weather data={weatherData} />
    </div>
  );
};
export default Clock;
