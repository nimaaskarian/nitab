import React from "react";
import ReactDOM from "react-dom";

//Alert provider
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// Global styles
import "fonts/font-awesome/css/brands.min.css";
import "fonts/font-awesome/css/regular.min.css";
import "fonts/font-awesome/css/solid.min.css";
import "fonts/font-awesome/css/fontawesome.min.css";

import "css/style.css";

// Redux Provider, Presistor, Store
import store, { persistor } from "store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//App component
import App from "./components/App";
//App boundry (error handling)
import AppErrorBoundry from "components/AppErrorBoundry";
// Alert default options
const alertOptions = {
  position: positions.BOTTOM_LEFT,
  timeout: 2500,
  offset: "20px",
  type: null,
  transition: transitions.FADE,
};

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <AppErrorBoundry>
          <App />
        </AppErrorBoundry>
      </AlertProvider>
    </PersistGate>
  </Provider>,
  document.querySelector("#root")
);
