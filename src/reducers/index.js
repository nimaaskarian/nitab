import { combineReducers } from "redux";
import { syncStorage } from "redux-persist-webextension-storage";
import localForage from "localforage";
import persistReducer from "redux-persist/es/persistReducer";
import { data } from "./data";
const config = {
  key: "data",
  storage: localForage.createInstance({
    name: "nitab",
    driver: localForage.LOCALSTORAGE,
    storeName: "data",
  }),
  deserialize: false,
  serialize: false,
  throttle: 250,
};

export default combineReducers({ data });
