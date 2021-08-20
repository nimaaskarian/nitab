import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import App from "./App";
import reducers from "./reducers";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const alertOptions = {
  position: positions.BOTTOM_LEFT,
  timeout: 2500,
  offset: "20px",
  type: null,
  transition: transitions.FADE,
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware()));
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <App />
    </AlertProvider>
  </Provider>,
  document.querySelector("#root")
);
