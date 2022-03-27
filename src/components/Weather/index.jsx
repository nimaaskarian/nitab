import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setWeatherData, setWeatherCity } from "store/actions";

import {
  WeatherWrapper,
  WeatherLoading,
  WeatherSelector,
  StyledTippy,
} from "./style";

import "tippy.js/dist/tippy.css";
import axios from "axios";
import { openWeather } from "apis";

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
const minutesToExpire = 30;
const Weather = (props) => {
  const data = useSelector(({ data }) => data.weather.data);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  // const city = useSelector(({ data }) => data.weather.city);
  useEffect(() => {
    (() => {
      if (data && data.time) {
        if (data.time <= new Date().getTime() + minutesToExpire * 60000) {
          return;
        }
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lon } }) => {
          setError("");

          openWeather
            .get("/weather", {
              params: {
                lat,
                lon,
              },
            })
            .then((r) => r.data)
            .then((data) =>
              dispatch(setWeatherData({ ...data, time: new Date().getTime() }))
            );
        },
        (e) => setError(e.message)
      );
    })();
  }, [data]);

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

  const renderedWeather = (props) => {
    if (data && data.main) {
      return (
        <>
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
                    ? `Feels Like: ${data.main.feels_like}°`
                    : ""}
                </span>
              </div>
            }
            visible={tempVisible}
            placement="bottom"
          >
            <span onClick={tempVisible ? tempHide : tempShow}>
              {Math.round(data.main.temp)}&#176;C
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
        </>
      );
    } else {
      return (
        <WeatherLoading>
          <i className="fa fa-spinner"></i>
        </WeatherLoading>
      );
    }
  };
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  return (
    <WeatherWrapper>
      <span style={{ marginRight: "15px" }}>{data.name}</span>
      {/* <WeatherSelector>
        <Dropdown
          options={["Automatic", ...cities]}
          onChange={(q) => {
            setWeatherCity(q.value);
          }}
          value={city}
          arrowClosed={<span className="fa fa-chevron-down" />}
          arrowOpen={<span className="fa fa-chevron-up" />}
        />
      </WeatherSelector> */}

      {error ? (
        <StyledTippy
          font={fontFamily}
          visible={error && errorMessageVisible}
          content={error}
          placement="bottom"
          onClickOutside={() => setErrorMessageVisible(false)}
          allowHTML
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setErrorMessageVisible(!errorMessageVisible)}
            className="fa fa-close"
          ></span>
        </StyledTippy>
      ) : (
        renderedWeather()
      )}
    </WeatherWrapper>
  );
};

export default Weather;
