import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./App";
import reducers from "./reducers";

const options = {
  position: positions.BOTTOM_LEFT,
  timeout: 2500,
  offset: "20px",
  type: null,
  transition: transitions.FADE,
};
const store = createStore(reducers);
ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.querySelector("#root")
);
