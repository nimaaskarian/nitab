import { Component } from "react";
import Alert from "components/Alert";
import { withAlert, types } from "react-alert";
import "./styles.css";

class AppErrorBoundry extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    console.log("Error: ");
    console.error(error);
    console.log("Error Info: ");
    console.error(info);
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      this.props.alert.show(<Alert>{this.state.error.message}</Alert>, {
        timeout: 0,
        type: types.ERROR,
      });
      return (
        <div className="error-message-wrapper">
          <h1>Ops! an error occurred...</h1>
          <p>
            fastest way to fix this is to refresh the application and don't do
            what you just did.
          </p>

          <p>
            you've been prompted by an error, you can see its full version in{" "}
            <span>console</span>
          </p>
          <p>
            you can report a issue with detailed error message and what you've
            done that led to this error at{" "}
            <a
              target="_blank"
              href="https://github.com/nimaaskarian/nitab/issues"
            >
              here
            </a>
          </p>
          <p>
            if refreshing didn't fix the problem, and you wanna fix the problem
            now, you can fix it by clearing the localstorage for this tab. using{" "}
            <span>localStorage.clear()</span> in your <span>console</span>
          </p>
          <p style={{ color: "#ece07a" }}>
            WARNING. THE METHOD ABOVE WILL CLEAR ALL YOUR CUSTIMZATIONS. DO NOT
            PURSUE FURTHER IF YOUR SETTINGS ARE IMPORTANT TO YOU. JUST REPORT
            THE ISSUE AND WAIT FOR AN UPDATE
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withAlert()(AppErrorBoundry);
