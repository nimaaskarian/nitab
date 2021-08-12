/*global chrome*/
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  createRef,
} from "react";

import { useAlert } from "react-alert";
import axios from "axios";
import { Helmet } from "react-helmet";
import Dropzone from "react-dropzone";
import { isDark } from "./js/isdark-min";
import localforage from "localforage";

import "localforage-observable/dist/localforage-observable.es6";
import AddTaskbar from "./components/AddTaskbar";
import Terminal from "./components/Terminal";
import Clock from "./components/Clock";
import SearchResults from "./components/SearchResult";
import TaskbarIcon from "./components/TaskbarIcon";
import Commands from "./components/Commands";
import isUrl from "./js/isUrl";
import defaultCommands from "./js/commands";

const defaultTitle = "New Tab !";

class App extends React.Component {
  state = {
    isHistory: 1,
    gradient: true,
    magnify: true,

    isTerminal: false,
    altNewtab: false,
    isTaskbarEdit: false,

    taskbarIcons: [],
    results: [],

    addtaskbarIndex: null,
    weather: null,
    background: null,

    commands: defaultCommands,
    foreground: "white",
    identifier: "/",
    term: "",

    blur: {
      terminal: "0",
      notTerminal: "0",
      setting: "10",
    },
    brightness: {
      terminal: "1",
      notTerminal: "1",
      setting: ".8",
    },
  };
  terminal = createRef();
  componentDidMount() {
    /***** CDM PRIVATE FUNCTIONS *****/
    const getWeather = async () => {
      axios
        .get("https://api.openweathermap.org/data/2.5/weather", {
          params: {
            q: "Tehran",
            appid: "a5de1d16384b2eff27f46fdb71b4ff4e",
            units: "metric",
          },
        })
        .then(({ data }) => {
          console.log(data);
          this.setState({ weather: { ...data, time: new Date().getTime() } });
          localforage.setItem("weather", {
            data,
            time: new Date().getTime(),
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const onNewCommand = (newValue) => {
      let temp = {};
      for (let command in newValue) {
        temp[command] = () => {
          if (newValue[command].length === 1)
            return ({ input }) => {
              const [hasntInput, hasInput] = newValue[command][0]
                .replace("%input%", input)
                .split("%?%");
              if (hasInput) {
                if (input) return defaultCommands.url(hasInput)();
                return defaultCommands.url(hasntInput)();
              }
              return defaultCommands.url(hasntInput)();
            };
          else
            return (input) => {
              newValue[command].forEach((element) => {
                const [hasntInput, hasInput] = element
                  .replace("%input%", input)
                  .split("%?%");

                if (hasInput) {
                  if (input) window.open(defaultCommands.url(hasInput)());
                  else window.open(defaultCommands.url(hasntInput)());
                } else window.open(defaultCommands.url(hasntInput)());
              });
            };
        };
      }
      this.setState({ commands: { ...this.state.commands, ...temp } });
    };
    const onNewBackground = (newValue) => {
      if (typeof newValue === "object") {
        this.setState({
          background: `url("${URL.createObjectURL(newValue)}")`,
        });
      } else {
        this.setState({ background: newValue });
      }
    };
    /***** CDM PRIVATE FUNCTIONS *****/

    /***** SETTING OBSERVABLES *****/
    localforage.ready(function () {
      var observable = localforage.newObservable();
      var subscription = observable.subscribe({
        next: function ({ key, oldValue, newValue }) {
          /***** EXTRA WORK BEFORE SETTING STATE *****/
          switch (key) {
            case "magnify":
              alert.show(
                <div className="alert">
                  Taskbar magnification is now{" "}
                  {newValue ? "enabled" : "disabled"}
                </div>
              );
              break;
            case "blur":
            case "brightness":
              alert.show(
                <div className="alert">
                  You've changed background {key}
                  <br />
                  Main: {newValue.notTerminal}
                  {key === "blur" ? "px" : null}
                  <br />
                  Terminal: {newValue.terminal}
                  {key === "blur" ? "px" : null}
                  <br />
                  Taskbar Menu: {newValue.setting}
                  {key === "blur" ? "px" : null}
                </div>,
                { timeout: 4500 }
              );
              break;
            case "foreground": {
              if (oldValue) {
                document.styleSheets[5].deleteRule(
                  document.styleSheets[5].cssRules.length - 2
                );
                document.styleSheets[5].deleteRule(
                  document.styleSheets[5].cssRules.length - 1
                );
              }
              if (newValue)
                this.onForegroundChange(document.styleSheets[5], newValue);
              break;
            }
            case "commands": {
              let updates = [];
              Object.keys(newValue).forEach((e) => {
                if (!Object.keys(oldValue).includes(e))
                  updates.push({ key: e, type: "add" });
              });
              Object.keys(oldValue).forEach((e) => {
                if (!Object.keys(newValue).includes(e))
                  updates.push({ key: e, type: "remove" });
              });
              if (updates.length)
                updates.forEach((e) => {
                  alert.show(
                    <div className="alert">
                      {e.type === "add"
                        ? `You've added "${e.key}" to your commands`
                        : `You've deleted "${e.key}" from your commands`}
                    </div>
                  );
                });
              else
                alert.show(
                  <div className="alert">
                    You've made some changes to your commands
                  </div>
                );
              break;
            }
          }
          /***** EXTRA WORK BEFORE SETTING STATE *****/

          /***** SETTING STATES  *****/
          switch (key) {
            case "background":
              if (typeof newValue === "object") {
                this.setState({
                  [key]: `url("${URL.createObjectURL(newValue)}")`,
                });
              } else {
                this.setState({ [key]: newValue });
              }
              break;
            case "commands":
              onNewCommand(newValue);
              break;
            case "weather":
              localforage.getItem("weather", (err, weather) => {
                if (!weather || !weather.time || !weather.data)
                  return getWeather();
                if (new Date().getTime() - weather.time > 3600 * 1000)
                  return getWeather();
                this.setState({
                  weather: { ...weather.data, time: weather.time },
                });
              });
              break;
            default:
              this.setState({ [key]: newValue });
              break;
          }
          /***** SETTING STATES  *****/
        },
      });
    });
    /***** SETTING OBSERVABLES *****/

    /***** GETTING STATES FOR FIRST TIME FROM LOCALSTORAGE *****/
    (async () => {
      for (const key of Object.keys(this.state)) {
        const result = await localforage.getItem(key);
        if (![null, undefined].includes(result)) {
          switch (key) {
            case "background":
              onNewBackground(result);
              break;
            case "command":
              onNewCommand(result);
            default:
              this.setState({ key: result });
              break;
          }
        }
      }
    })();
    /***** GETTING STATES FOR FIRST TIME FROM LOCALSTORAGE *****/

    /***** KEYDOWN EVENTLISTENER *****/
    const onKeydown = (e) => {
      e.stopPropagation();
      if (e.ctrlKey && e.code === "KeyB") {
        localforage.getItem("altNewtab", (err, result) => {
          alert.show(
            <div className="alert">
              {result
                ? "Default enter behaviour is now new tab"
                : "Default enter behaviour is now current tab"}
            </div>
          );
          this.setState(!result);
          localforage.setItem("altNewtab", !result);
        });
      }
      if (e.ctrlKey && e.code === "KeyQ") {
        const { isHistory } = this.state;
        this.setState({ isHistory: isHistory + 1 > 2 ? 0 : isHistory + 1 });
      }
      if (e.key === "Escape") {
        this.setState({ isTerminal: false });
        return;
      }
      if (e.altKey && parseInt(e.key)) {
        if (this.state.isTerminal)
          try {
            document
              .querySelectorAll(".search-result")
              [parseInt(e.key) - 1].click();
            return;
          } catch (error) {}
        else
          try {
            document
              .querySelectorAll(".taskbar-icon:not(.empty)")
              [parseInt(e.key) - 1].click();
            return;
          } catch (error) {}
      }

      if (["Alt", "Tab"].includes(e.key)) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey && e.ctrlKey && e.code === "KeyI") return;
      if (["Meta", "Control", "Shift"].includes(e.key)) {
        return;
      }
      if (e.key === "Backspace" && !this.statea.term) return;
      if (!e.altKey) {
        this.setState({ isTerminal: true });
        this.terminal.current.focus();
      } else {
        e.preventDefault();
      }
    };
    if ("?command=true" !== window.location.search && !this.state.isTaskbarEdit)
      window.addEventListener("keydown", onKeydown);
    /***** KEYDOWN EVENTLISTENER *****/
  }
  componentDidUpdate(prevProps, prevState) {
    /***** Preps ******/
    const updates = [];
    Object.keys(this.state).forEach((key) => {
      if (prevState[key] !== this.state[key]) updates.push(key);
    });
    const effect = (effect, deps) => {
      let isEffect = false;
      deps.forEach((effect) => {
        isEffect = isEffect || updates.includes[effect];
      });
      if (isEffect) effect();
    };
    /***** Preps ******/

    effect();
  }

  /***** METHODS *****/
  onForegroundChange = (stylesheet, color) => {
    stylesheet.insertRule(
      `.foreground-change *,.foreground-change{color:${color};}`,
      stylesheet.rules.length
    );
    stylesheet.insertRule(
      `.foreground-change *::selection,.foreground-change::selection{background-color:${color};color:${
        isDark(color) ? "#CCC" : "#333"
      };}`,
      stylesheet.rules.length
    );
  };
  onTaskbarMouseMove = (e) => {
    if (!this.state.isTaskbarEdit && this.state.magnify)
      document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
        const { left } = i.getBoundingClientRect();
        let distance = Math.abs(e.clientX - left - i.offsetWidth / 2) / 30;
        if (distance < 1) distance = 1;

        i.style.fontSize = parseInt((35 + 17.5 / distance) * 10) / 10 + "px";
      });
  };
  onAddtaskbarSubmit = ({ icon, color, url, index }) => {
    (async () => {
      let _taskbarIcons = (await localforage.getItem("taskbarIcons")) || [];
      const realIndex = _taskbarIcons.length;
      if (index === -1)
        _taskbarIcons.push({ icon, url, color, index: realIndex });
      else {
        if (icon === "empty")
          _taskbarIcons.splice(index, 0, {
            icon,
            url,
            color,
            index: index,
          });
        else
          _taskbarIcons[index] = {
            icon,
            url,
            color,
            index: index,
          };
      }

      localforage.setItem("taskbarIcons", _taskbarIcons);
    })();
  };
  /***** METHODS *****/

  /***** RENDER METHODS *****/
  renderedNoTerminal = () => {
    return (
      <React.Fragment>
        <Helmet>
          <title>{defaultTitle}</title>
        </Helmet>
        <div
          {...getRootProps()}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <input {...getInputProps()} id="image-input" />
          <div
            className={`input-label-wrapper ${
              this.state.gradient ? "" : "no-gradient"
            }`}
          >
            <label
              htmlFor="image-input"
              className="fa fa-image foreground-change input-label"
            />
          </div>
        </div>

        <div style={{ display: `${isTerminal ? "none" : "contents"}` }}>
          {this.state.isTaskbarEdit ? (
            <AddTaskbar
              setIsTaskbar={(e) => this.setState({ isTaskbarEdit: e })}
              onSubmit={this.onAddtaskbarSubmit}
              taskbarIcons={this.state.taskbarIcons}
              selectedIndex={this.state.addtaskbarIndex}
              onIndexChange={() => this.setState({ addtaskbarIndex: null })}
            />
          ) : isDragActive && isDragAccept ? (
            <h1 className="foreground-change">Drop the picture...</h1>
          ) : (
            <Clock weatherData={weatherData} />
          )}
          {taskbarIcons && taskbarIcons.length ? (
            <div
              className={`taskbar ${gradient ? "" : "no-gradient"}`}
              onMouseEnter={this.onTaskbarMouseMove}
              onMouseMove={this.onTaskbarMouseMove}
              onMouseOut={() => {
                document
                  .querySelectorAll(".taskbar-icon:not(.empty)")
                  .forEach((i) => {
                    i.style.fontSize = "35px";
                  });
              }}
            >
              {taskbarIcons.map((e, i) => {
                return (
                  <TaskbarIcon
                    onClick={(e) => {
                      this.setState({ addtaskbarIndex: e });
                    }}
                    key={i}
                    bgColor={
                      e.icon === "empty" && isTaskbarEdit
                        ? "rgba(87, 87, 87, 0.36)"
                        : null
                    }
                    index={e.index}
                    color={e.color}
                    isBlank={!this.state.altNewtab}
                    icon={e.icon}
                    url={this.state.isTaskbarEdit ? "" : e.url}
                    onDblClick={(e) => {
                      if (this.state.isTaskbarEdit)
                        localforage.getItem("taskbarIcons", (err, result) => {
                          result.splice(i, 1);
                          localforage.setItem("taskbarIcons", result);
                        });
                    }}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  };
  renderedTerminal = () => {
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.term}</title>
        </Helmet>
        <div style={{ display: `${this.state.isTerminal ? "block" : "none"}` }}>
          {this.state.isHistory ? (
            <div
              className={`ctrl-item foreground-change ${
                this.state.gradient ? "" : "no-gradient"
              }`}
            >
              {this.state.isHistory === 1 ? "History" : "Bookmark"}
            </div>
          ) : null}

          <Terminal
            identifier={this.state.identifier}
            commands={this.state.commands}
            term={this.state.term}
            setIsTaskbar={(e) => this.setState({ isTaskbarEdit: e })}
            altNewtab={this.state.altNewtab}
            ref={this.terminal}
            onChange={(term) =>
              this.setState({
                term,
                isTerminal: !!term,
              })
            }
          />

          <div style={{ marginTop: "50px" }} className="search-results">
            {this.state.results
              .filter((e) => !!e)
              .map((e, i) => {
                return (
                  <SearchResults
                    onClick={() => {
                      if (typeof e.url === "string") {
                        if (!this.state.altNewtab) window.open(e.url);
                        else document.location = e.url;
                      } else {
                        e.url(this.state.altNewtab);
                      }
                    }}
                    key={i}
                    header={{
                      text: e.title,
                      className: e.header ? e.header.className : "",
                    }}
                  >
                    {e.url}
                  </SearchResults>
                );
              })}
          </div>
        </div>
      </React.Fragment>
    );
  };
  /***** RENDER METHODS *****/
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            color: foreground,
            background: background || "#333",
            filter: `blur(${
              isTaskbarEdit
                ? blur.setting
                : this.state.isTerminal
                ? blur.terminal
                : blur.notTerminal
            }px) brightness(${
              isTaskbarEdit
                ? brightness.setting
                : this.state.isTerminal
                ? brightness.terminal
                : brightness.notTerminal
            })`,
          }}
          className={`background ${this.state.isTerminal ? "isTerminal" : ""} ${
            this.state.gradient ? "" : "no-gradient"
          } ${this.state.isTaskbarEdit ? "super-blured" : ""}`}
        />

        <div className="keepcentered">
          {this.state.isTerminal ? renderedTerminal() : renderedNoTerminal()}
        </div>
      </React.Fragment>
    );
  }
}
export default App;
