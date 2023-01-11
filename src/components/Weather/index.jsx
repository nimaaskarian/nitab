import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setSideMenuIndex,
  setWeatherData,
  setWeatherIsAutomatic,
} from "store/actions";

import {
  WeatherWrapper,
  WeatherLoading,
  StyledTippy,
  CityNameWrapper,
  WeatherIcon,
} from "./style";

import "tippy.js/dist/tippy.css";
import { openWeather } from "apis";
import { types, useAlert } from "react-alert";
import Alert from "components/Alert";
import needsRefresh from "services/Weather/needsRefresh";
import fetchWeather from "services/Weather/fetchWeather";

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
  const data = useSelector(({ data }) => data.weather.data);
  const isImperial = useSelector(({ data }) => data.weather.imperial);

  console.log(data)
  const dispatch = useDispatch();
  const alert = useAlert();
  const [error, setError] = useState("");
  const city = useSelector(
    ({ data }) => (data.weather.cities || [])[data.weather.index]
  );
  const isAutomatic = useSelector(({ data }) => data.weather.isAutomatic);

  useEffect(() => {
    if (!isAutomatic && city) {
      const { lon, lat } = city;
      fetchWeather({ lon, lat }, city.name, (e) => setError(e.message));
    }
  }, [city, isAutomatic]);

  useEffect(() => {
    (() => {
      if (isAutomatic && needsRefresh("", data))
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lon } }) => {
            fetchWeather({ lat, lon });
          },
          (e) => {
            alert.show(<Alert>Automatic Weather: {e.message}</Alert>, {
              type: types.ERROR,
              timeout: 4500,
            });
            dispatch(setWeatherIsAutomatic(false));
          }
        );
    })();
  }, [isAutomatic, data]);

  const fontFamily = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].font
  );

  const [conditionVisible, setConditionVisible] = useState(false);
  const conditionShow = () => setConditionVisible(true);
  const conditionHide = () => setConditionVisible(false);

  const [tempVisible, setTempVisible] = useState(false);
  const tempShow = () => setTempVisible(true);
  const tempHide = () => setTempVisible(false);

  const spanStyle = { margin: "0 5px" };
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);

  const convertWeather=(celsiusTemp)=>{
    if (!isImperial) return celsiusTemp
    return ((celsiusTemp*9/5 )+32)
  }
  console.log("is imperial",isImperial)
  const temperatureSymbol = "°"+(isImperial?"F":"C")

  if (error) {
    return (
      <StyledTippy
        font={fontFamily}
        visible={error && errorMessageVisible}
        content={error}
        placement="bottom"
        onClickOutside={() => setErrorMessageVisible(false)}
        allowHTML
      >
        <WeatherIcon
          style={{ cursor: "pointer" }}
          onClick={() => setErrorMessageVisible(!errorMessageVisible)}
          className="fa fa-close"
        />
      </StyledTippy>
    );
  }
  if (!data || !data.main) {
    return (
      <WeatherLoading
        onClick={() => {
          dispatch(setSideMenuIndex(4));
        }}
      >
        <i className="fa fa-spinner"></i>
      </WeatherLoading>
    );
  }
  return (
    <WeatherWrapper>
      <CityNameWrapper
        onClick={() => {
          dispatch(setSideMenuIndex(4));
        }}
      >
        {data.name}
      </CityNameWrapper>
      <StyledTippy
        font={fontFamily}
        allowHTML
        onClickOutside={tempHide}
        content={
          <div>
            <span style={spanStyle}>
              <i className="fa fa-temperature-half" />
              {data.main.temp}°
            </span>
            <span style={spanStyle}>
              <i className="fa fa-droplet-percent" />
              {data.main.humidity}%
            </span>
            <span style={spanStyle}>
              {data.main.feels_like !== data.main.temp
                ? `Feels Like: ${convertWeather(data.main.feels_like)+temperatureSymbol}`
                : ""}
            </span>
          </div>
        }
        visible={tempVisible}
        placement="bottom"
      >
        <span onClick={tempVisible ? tempHide : tempShow}>
          {Math.round(convertWeather(data.main.temp))+temperatureSymbol}
        </span>
      </StyledTippy>
      <StyledTippy
        font={fontFamily}
        onClickOutside={conditionHide}
        content={data.weather[0].description}
        visible={conditionVisible}
        placement="bottom"
      >
        <i
          onClick={conditionVisible ? conditionHide : conditionShow}
          style={{ marginLeft: "5px" }}
          className={`fa ${icons[data.weather[0].icon]}`}
        />
      </StyledTippy>
    </WeatherWrapper>
  );
};

export default Weather;
