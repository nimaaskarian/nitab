import React from "react";
import ReactDOM from "react-dom";

//Alert provider
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

// Global styles
import "./font-awesome/css/brands.min.css";
import "./font-awesome/css/light.min.css";
import "./font-awesome/css/solid.min.css";
import "./font-awesome/css/fontawesome.min.css";
import "./css/publicStyle.css";

// Redux Provider, Presistor, Store
import store, { persistor } from "store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//App component
import App from "./components/App";
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
