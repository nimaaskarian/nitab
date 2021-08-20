import axios from "axios"

export const weather = axios.create({
  baseURL:"https://api.openweathermap.org/data/2.5",
  params:{
    appid: "a5de1d16384b2eff27f46fdb71b4ff4e",
    units: "metric",
  }
})
export const unsplash = axios.create()

