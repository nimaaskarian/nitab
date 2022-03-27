import { combineReducers } from "redux";
import localForage from "localforage";
import persistReducer from "redux-persist/es/persistReducer";
import data from "./data";
import ui from "./ui";

export const storage = localForage.createInstance({
  name: "nitab",
  driver: localForage.LOCALSTORAGE,
  storeName: "nitab",
});
const config = {
  key: "nitab",
  storage,
};

export default combineReducers({ ui, data: persistReducer(config, data) });
