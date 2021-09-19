/*global chrome*/
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setWeatherData, setWeatherCity } from "../actions";
import Dropdown from "react-dropdown";
import { cities } from "../utils";

const icons = {
  "01d": "fa-sun",
  "01n": "fa-moon",

  "02d": "fa-cloud-sun",
  "02n": "fa-cloud-moon",

  "03d": "fa-cloud",
  "03n": "fa-cloud",

  "04d": "fa-clouds",
  "04n": "fa-clouds",

  "09d": "fa-cloud-showers-heavy",
  "09n": "fa-cloud-showers-heavy",

  "10d": "fa-cloud-sun-rain",
  "10n": "fa-cloud-moon-rain",

  "11d": "fa-thunderstorm",
  "11n": "fa-thunderstorm",

  "13d": "fa-snowflake",
  "13n": "fa-snowflake",

  "50d": "fa-fog",
  "50n": "fa-fog",
};
const Weather = (props) => {
  //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  const isDay = (t) => {
    return new Date(t).getHours() > 6 && new Date(t).getHours() < 20;
  };
  useEffect(() => {
    props.setWeatherData(props.city);
  }, [props.city]);
  if (props.data && props.data.main)
    return (
      <div className="weather" style={{ marginTop: ".5rem", fontSize: "1rem" }}>
        <div style={{ marginRight: "5px" }} className="weather-selector">
          <Dropdown
            options={cities}
            onChange={(q) => {
              props.setWeatherCity(q.value);
            }}
            value={props.city}
            arrowClosed={<span className="fa fa-chevron-down" />}
            arrowOpen={<span className="fa fa-chevron-up" />}
          />
        </div>
        {Math.round(props.data.main.temp)}&#176;C
        <i
          style={{ marginLeft: "5px" }}
          className={`fa ${icons[props.data.weather[0].icon]}`}
        ></i>
      </div>
    );
  return <div>Gathering Data</div>;
};
const mapStateToProp = ({ data }) => {
  if (data.weatherData && data.weatherCity)
    return { data: data.weatherData.data, city: data.weatherCity };
};
export default connect(mapStateToProp, { setWeatherData, setWeatherCity })(
  Weather
);
