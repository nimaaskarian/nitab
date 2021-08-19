import React from "react";
import ReactDOM from "react-dom";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import App from "./App";
const options = {
  position: positions.BOTTOM_LEFT,
  timeout: 2500,
  offset: "20px",
  type: null,
  transition: transitions.FADE,
};

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>,
  document.querySelector("#root")
);
