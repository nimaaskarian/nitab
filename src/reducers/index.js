import { combineReducers } from "redux";
import localForage from "localforage";
import persistReducer from "redux-persist/es/persistReducer";
import { data } from "./data";
const config = {
  key: "data",
  storage:  localForage.createInstance({
    name: "nitab",
    driver: localForage.LOCALSTORAGE,
    storeName: "data",
  }),
 
};

export default combineReducers({ data: persistReducer(config, data) });
