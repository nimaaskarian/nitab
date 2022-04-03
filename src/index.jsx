import React from "react";
import ReactDOM from "react-dom";

//Alert provider
import { transitions, positions, Provider as AlertProvider, types } from "react-alert";
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
import App from "components/App";
import AppErrorBoundry from "components/AppErrorBoundry";
// Alert default options
const alertOptions = {
  position: positions.BOTTOM_RIGHT,
  timeout: 2000,
  offset: "5px",
  type: types.INFO,
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
