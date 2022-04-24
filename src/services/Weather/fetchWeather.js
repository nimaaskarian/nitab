import { setWeatherData } from "store/actions";
import { openWeather } from "apis";
import store from "store";
import needsRefresh from "./needsRefresh";
const fetchWeather = ({ lon, lat }, city = "", onError = () => {}) => {
  const previousData = store.getState().data.weather.data;
  if (needsRefresh(city, previousData)) {
    store.dispatch(setWeatherData({}));
    openWeather
      .get("/weather", {
        params: {
          lat,
          lon,
        },
      })
      .then((r) => r.data)
      .then((data) =>
        store.dispatch(
          setWeatherData({ ...data, time: new Date().getTime(), city: city })
        )
      )
      .catch((e) => {
        onError(e);
      });
  }
};
export default fetchWeather;
