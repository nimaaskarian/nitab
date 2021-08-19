/*global chrome*/
import React from "react";

export default ({ data }) => {
  //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  const icons = {
    "clear sky": {
      night: "fa-moon",
      day: "sun",
    },
    "few clouds": {
      night: "fa-cloud-moon",
      day: "fa-cloud-sun",
    },
    "scattered clouds": {
      night: "fa-cloud",
      day: "fa-cloud",
    },
    "broken clouds": {
      night: "fa-clouds",
      day: "fa-clouds",
    },
    "shower rain": {
      night: "fa-cloud-showers-heavy",
      day: "fa-cloud-showers-heavy",
    },
    rain: {
      night: "fa-cloud-moon-rain",
      day: "fa-cloud-sun-rain",
    },
    thunderstorm: {
      night: "fa-thunderstorm",
      day: "fa-thunderstorm",
    },
    snow: {
      night: "fa-snowflake",
      day: "fa-snowflake",
    },
    mist: {
      night: "fa-fog",
      day: "fa-fog",
    },
  };
  const isDay = (t) => {
    return new Date(t).getHours() > 6 && new Date(t).getHours() < 20;
  };fafasdfdsafsadfasddssadfasdfs

  if (data)
    return (
      <div className="weather" style={{ marginTop: ".5rem", fontSize: "1rem" }}>
        <span style={{ marginRight: "5px" }}>{data.name}</span>
        {Math.round(data.main.temp)}&#176;C
        <i
          style={{ marginLeft: "5px" }}
          className={
            "fa " +
            icons[data.weather[0].description][
              isDay(data.time) ? "day" : "night"
            ]
          }
        ></i>
      </div>
    );
  return <div>Gathering Data</div>;
};
