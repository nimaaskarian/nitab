import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Dropdown from "react-dropdown";
import Tippy from "@tippyjs/react";

import { setWeatherData, setWeatherCity } from "store/actions";

import cities from "services/Lists/cities";

import "tippy.js/dist/tippy.css";

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
  const [conditionVisible, setConditionVisible] = useState(false);
  const conditionShow = () => setConditionVisible(true);
  const conditionHide = () => setConditionVisible(false);

  const [tempVisible, setTempVisible] = useState(false);
  const tempShow = () => setTempVisible(true);
  const tempHide = () => setTempVisible(false);

  const spanStyle = { margin: "0 5px" };
  useEffect(() => {
    props.setWeatherData(props.city);
  }, [props.city]);
  useEffect(() => {
    const stylesheet = document.styleSheets[document.styleSheets.length - 2];
    stylesheet.insertRule(
      `.tippy-box{font-family:${props.font};}`,
      stylesheet.rules.length
    );
  }, [props.font]);

  const renderedWeather = (props) => {
    if (props.data && props.data.main) {
      return (
        <>
          <Tippy
            allowHTML
            onClickOutside={tempHide}
            content={
              <div>
                <span style={spanStyle}>
                  <i className="fa fa-temperature-half" />
                  {props.data.main.temp}°
                </span>
                <span style={spanStyle}>
                  <i className="fa fa-droplet-percent" />
                  {props.data.main.humidity}%
                </span>
                <span style={spanStyle}>
                  {props.data.main.feels_like !== props.data.main.temp
                    ? `Feels Like: ${props.data.main.feels_like}°`
                    : ""}
                </span>
              </div>
            }
            visible={tempVisible}
            placement="bottom"
          >
            <span onClick={tempVisible ? tempHide : tempShow}>
              {Math.round(props.data.main.temp)}&#176;C
            </span>
          </Tippy>
          <Tippy
            onClickOutside={conditionHide}
            content={props.data.weather[0].description}
            visible={conditionVisible}
            placement="bottom"
          >
            <i
              onClick={conditionVisible ? conditionHide : conditionShow}
              style={{ marginLeft: "5px" }}
              className={`fa ${icons[props.data.weather[0].icon]}`}
            />
          </Tippy>
        </>
      );
    } else {
      return (
        <div className="weather-unloaded">
          <i className="fas fa-spinner"></i>
        </div>
      );
    }
  };

  return (
    <div className="weather">
      <div style={{ marginRight: "5px" }} className="weather-selector">
        <Dropdown
          options={["Automatic", ...cities]}
          onChange={(q) => {
            props.setWeatherCity(q.value);
          }}
          value={props.city}
          arrowClosed={<span className="fa fa-chevron-down" />}
          arrowOpen={<span className="fa fa-chevron-up" />}
        />
      </div>

      {renderedWeather(props)}
    </div>
  );
};
const mapStateToProp = ({ data }) => {
  if (data.weatherData && data.weatherCity)
    return {
      data: data.weatherData.data,
      city: data.weatherCity,
      font: data.font,
    };
};
export default connect(mapStateToProp, { setWeatherData, setWeatherCity })(
  Weather
);
