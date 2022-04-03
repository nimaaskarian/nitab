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
} from "./style";

import "tippy.js/dist/tippy.css";
import { openWeather } from "apis";
import { types, useAlert } from "react-alert";
import Alert from "components/Alert";

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
  const alert = useAlert();
  const [error, setError] = useState("");
  const city = useSelector(
    ({ data }) => (data.weather.cities || [])[data.weather.index]
  );
  const isAutomatic = useSelector(({ data }) => data.weather.isAutomatic);
  const isRefreshNeeded = (city) => {
    if (data && data.time) {
      if (data.city !== city) {
        return true;
      }
      if (new Date().getTime() < data.time + minutesToExpire * 60000) {
        return false;
      }
    }
    return true;
  };
  const getWeather = ({ lon, lat }, city = "") => {
    if (isRefreshNeeded(city))
      openWeather
        .get("/weather", {
          params: {
            lat,
            lon,
          },
        })
        .then((r) => r.data)
        .then((data) =>
          dispatch(
            setWeatherData({ ...data, time: new Date().getTime(), city: city })
          )
        )
        .catch((e) => {
          setError(e.message);
        });
  };
  useEffect(() => {
    if (!isAutomatic && city) {
      const { lon, lat } = city;
      getWeather({ lon, lat }, city.name);
    }
  }, [city, isAutomatic]);

  useEffect(() => {
    (() => {
      if (isAutomatic && isRefreshNeeded(""))
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lon } }) => {
            getWeather({ lat, lon });
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
      <CityNameWrapper
        onClick={() => {
          dispatch(setSideMenuIndex(4));
        }}
      >
        {data.name}
      </CityNameWrapper>
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
          />
        </StyledTippy>
      ) : (
        renderedWeather()
      )}
    </WeatherWrapper>
  );
};

export default Weather;
