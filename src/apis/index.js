import axios from "axios";

export const openWeather = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: "a5de1d16384b2eff27f46fdb71b4ff4e",
    units: "metric",
  },
});
export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com/photos",
  params: {
    client_id: "Oi5eeseZ0KatuzRuE5P1HFP7bk7UIUC-jIFXY5nS154",
  },
});
