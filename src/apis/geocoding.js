import axios from "axios";

const geocoding = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
});

export default geocoding;
