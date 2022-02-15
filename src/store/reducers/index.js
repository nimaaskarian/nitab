import { combineReducers } from "redux";
import localForage from "localforage";
import persistReducer from "redux-persist/es/persistReducer";
import data from "./data";
import ui from "./ui";

const config = {
  key: "data",
  storage: localForage.createInstance({
    name: "nitab",
    driver: localForage.LOCALSTORAGE,
    storeName: "data",
  }),
};

export default combineReducers({ ui, data: persistReducer(config, data) });
