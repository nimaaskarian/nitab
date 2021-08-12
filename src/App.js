/*global chrome*/
import React, { useRef, useEffect, useState, useCallback } from "react";

import { useAlert } from "react-alert";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useDropzone } from "react-dropzone";
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
import commandsDefault, { termToCommand } from "./js/commands";
const getAll = async () => {
  let output = {};
  const keys = await localforage.keys();
  for (let key of keys) {
    const value = await localforage.getItem(key);
    if (![undefined, null].includes(value)) output[key] = value;
  }
  return output;
};
const defaultTitle = "New Tab !";
const App = ({ onClockPosChange }) => {
  const [results, setResults] = useState([]);
  const [isHistory, setIsHistory] = useState(1); //bookmark === 0, history === 1, nothing === 0
  const [isTerminal, setIsTerminal] = useState(false);
  const [altNewtab, setAltNewtab] = useState(false);
  const [taskbarIcons, setTaskbarIcons] = useState([]);
  const [isTaskbarEdit, setIsTaskbarEdit] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [background, setBackground] = useState(null);
  const [commands, setCommands] = useState(commandsDefault);
  const [foreground, setForeground] = useState("white");
  const [gradient, setGradient] = useState(true);
  const [magnify, setMagnify] = useState(true);
  const [parallex, setParallex] = useState({ x: 0, y: 0 });
  const [parallexFactor, setParallexFactor] = useState(5);
  const [font, setFont] = useState("Inconsolata");
  const [clockAlign, setClockAlign] = useState("center");
  const [clockPos, setClockPos] = useState("center");

  const [isParallex, setIsParallex] = useState(false);

  const [identifier, setIndentifier] = useState("/");

  const [blur, setBlur] = useState({
    terminal: "0",
    notTerminal: "0",
    setting: "10",
  });
  const [brightness, setBrightness] = useState({
    terminal: "1",
    notTerminal: "1",
    setting: ".8",
  });
  const [term, setTerm] = useState("");
  const [addtaskbarIndex, setAddtaskbarIndex] = useState(null);

  const terminal = useRef();
  const alert = useAlert();
  const onForegroundChange = (stylesheet, color) => {
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
  const onDropAccepted = useCallback((files) => {
    alert.show(
      <div className="alert">
        {files[0].name} has equiped as your background picture
      </div>
    );
    const bgBlob = new Blob([files[0]], { type: "image/*" });
    localforage.setItem("background", bgBlob);
  }, []);
  const onDropRejected = useCallback((files, e) => {
    alert.error(
      <div className="alert">
        {files[0].errors[0].code === "file-invalid-type"
          ? files[0].file.name + "'s file format is not supported"
          : files[0].errors[0].message}
      </div>
    );
  }, []);
  const { isDragAccept, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDropAccepted,
      onDropRejected,
      accept: "image/*",
      multiple: false,
    });
  useEffect(() => {
    const mouseOver = (e) => {
      const x = 0.5 - Math.round((e.clientX / window.innerWidth) * 10) / 10;
      const y = 0.5 - Math.round((e.clientY / window.innerHeight) * 10) / 10;
      setParallex({ x, y });
    };
    if (isParallex) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [isParallex]);
  useEffect(() => {
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
                if (input) return commands.url(hasInput)();
                return commands.url(hasntInput)();
              }
              return commands.url(hasntInput)();
            };
          else
            return (input) => {
              newValue[command].forEach((element) => {
                const [hasntInput, hasInput] = element
                  .replace("%input%", input)
                  .split("%?%");

                if (hasInput) {
                  if (input) window.open(commands.url(hasInput)());
                  else window.open(commands.url(hasntInput)());
                } else window.open(commands.url(hasntInput)());
              });
            };
        };
      }
      setCommands({ ...commands, ...temp });
    };
    localforage.ready(function () {
      var observable = localforage.newObservable();
      var subscription = observable.subscribe({
        next: function ({ key, oldValue, newValue }) {
          switch (key) {
            case "brightness":
            case "blur":
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
              stateToSet[key](newValue);
              break;
            case "magnfiy": {
              setMagnify(newValue);
              alert.show(
                <div className="alert">
                  Taskbar magnification is now{" "}
                  {newValue ? "enabled" : "disabled"}
                </div>
              );
              break;
            }
            case "foreground": {
              if (oldValue) {
                document.styleSheets[5].deleteRule(
                  document.styleSheets[5].cssRules.length - 2
                );
                document.styleSheets[5].deleteRule(
                  document.styleSheets[5].cssRules.length - 1
                );
              }
              onForegroundChange(document.styleSheets[5], newValue);

              setForeground(newValue);
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
              onNewCommand(newValue);
              break;
            }
            default:
              stateToSet[key](newValue);
              break;
          }
        },
      });
    });
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
          setWeatherData({ ...data, time: new Date().getTime() });
          localforage.setItem("weather", {
            data,
            time: new Date().getTime(),
          });
        });
    };
    const stateToSet = {
      background: (result) => {
        if (typeof result === "object") {
          try {
            setBackground(`url("${URL.createObjectURL(result)}")`);
          } catch (error) {}
        } else {
          setBackground(result);
        }
      },
      parallex: setIsParallex,
      "parallex-factor": setParallexFactor,
      gradient: setGradient,
      indetifier: (result) => {
        if (![undefined, null].includes(result)) setIndentifier(result);

        const _iden = result || identifier;
        alert.show(
          <div className="alert">
            Command Identifier: {_iden === "NONE" ? "none" : `"${_iden}"`}
          </div>,
          {
            timeout: 3000,
          }
        );
      },
      font: setFont,
      magnify: setMagnify,
      foreground: (result) => {
        onForegroundChange(document.styleSheets[5], result);
        setForeground(result);
      },
      commands: onNewCommand,
      search: setIsHistory,
      taskbarIcons: setTaskbarIcons,
      brightness: setBrightness,
      blur: setBlur,
      altNewtab: setAltNewtab,
      weather: (result) => {
        if (!result.time || !result.data) return getWeather();
        if (new Date().getTime() - result.time > 3600 * 1000)
          return getWeather();
        setWeatherData({ ...result.data, time: result.time });
      },
      clockAlign: (result) => {
        setClockAlign(result);
        setIsTerminal(false);
        setTerm("");
      },
      clockPos: (result) => {
        setClockPos(result);
        setIsTerminal(false);
        setTerm("");
      },
    };
    (async () => {
      const data = await getAll();
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (stateToSet[key]) stateToSet[key](value);
      });
    })();
  }, []);

  useEffect(() => {
    const onKeydown = (e) => {
      e.stopPropagation();
      if (e.ctrlKey && e.code === "KeyB") {
        alert.show(
          <div className="alert">
            {altNewtab
              ? "Default enter behaviour is now new tab"
              : "Default enter behaviour is now current tab"}
          </div>
        );
        setAltNewtab(!altNewtab);
        localforage.setItem("altNewtab", !altNewtab);
      }
      if (e.ctrlKey && e.code === "KeyQ") {
        setIsHistory(isHistory + 1 > 2 ? 0 : isHistory + 1);
        localforage.setItem("search", isHistory);
      }
      if (e.key === "Escape") {
        setIsTerminal(false);
        return;
      }
      if (e.altKey && parseInt(e.key)) {
        if (isTerminal)
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
      if (e.key === "Backspace" && !term) return;
      if (!e.altKey) {
        setIsTerminal(true);
        terminal.current.focus();
      } else {
        e.preventDefault();
      }
    };
    if ("?command=true" !== window.location.search && !isTaskbarEdit)
      window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isTerminal, isHistory, isTaskbarEdit]);

  useEffect(() => {
    if (term) {
      chromeHistory(term);
    } else setResults([]);
  }, [isHistory, term]);

  const chromeHistory = (term) => {
    const searchSuggest = (term) => {
      if (termToCommand(term, identifier, commands).name !== "search")
        return {
          url: commands["search"](term),
          header: {
            className: "fontawe search",
          },
          title: term,
        };
    };
    const onSearchComplete = (e) => {
      setResults([searchSuggest(term), ...e]);
    };
    if (isHistory === 2) {
      chrome.bookmarks.search({ query: term }, (res) => {
        onSearchComplete(res.slice(0, 3 + !isUrl(term)));
      });
    } else if (isHistory === 1) {
      if (chrome.history)
        chrome.history.search(
          {
            text: term,
            startTime: new Date().getTime() - 14 * 24 * 3600 * 1000,
            maxResults: 3 + !isUrl(term),
          },
          (res) => {
            onSearchComplete(res);
          }
        );
    } else setResults([searchSuggest(term)]);
  };
  useEffect(() => {
    if (isTaskbarEdit) {
      setIsTerminal(false);
      setTerm("");
    }
  }, [isTaskbarEdit]);
  const onTaskbarMouseMove = (e) => {
    if (!isTaskbarEdit && magnify)
      document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
        const { left } = i.getBoundingClientRect();
        let distance = Math.abs(e.clientX - left - i.offsetWidth / 2) / 30;
        if (distance < 1) distance = 1;

        i.style.fontSize = parseInt((35 + 17.5 / distance) * 10) / 10 + "px";
      });
  };
  const onAddtaskbarSubmit = ({ icon, color, url, index }) => {
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

  if (window.location.search === "?command=true") return <Commands />;
  const renderedNoTerminal = () => {
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
          {/* <div
            className={`input-label-wrapper ${gradient ? "" : "no-gradient"}`}
          >
            <label
              htmlFor="image-input"
              className="fa fa-image foreground-change input-label"
            />
          </div> */}
        </div>

        <div style={{ display: `${isTerminal ? "none" : "contents"}` }}>
          {isTaskbarEdit ? (
            <AddTaskbar
              setIsTaskbar={setIsTaskbarEdit}
              onSubmit={onAddtaskbarSubmit}
              taskbarIcons={taskbarIcons}
              selectedIndex={addtaskbarIndex}
              onIndexChange={() => setAddtaskbarIndex(null)}
            />
          ) : isDragActive && isDragAccept ? (
            <h1 className="foreground-change">Drop the picture...</h1>
          ) : (
            <Clock
              weatherData={weatherData}
              style={{
                position: clockPos !== "center" ? "absolute" : null,
                top: clockPos !== "center" ? "20px" : null,
                [clockPos]: "5vw",
                alignItems: clockAlign,
              }}
            />
          )}
          {taskbarIcons && taskbarIcons.length ? (
            <div
              className={`taskbar ${gradient ? "" : "no-gradient"}`}
              onMouseEnter={onTaskbarMouseMove}
              onMouseMove={onTaskbarMouseMove}
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
                    onClick={setAddtaskbarIndex}
                    key={i}
                    bgColor={
                      e.icon === "empty" && isTaskbarEdit
                        ? "rgba(87, 87, 87, 0.36)"
                        : null
                    }
                    index={e.index}
                    color={e.color}
                    isBlank={!altNewtab}
                    icon={e.icon}
                    url={isTaskbarEdit ? "" : e.url}
                    onDblClick={(e) => {
                      if (isTaskbarEdit)
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
  const renderedTerminal = () => {
    return (
      <React.Fragment>
        <Helmet>
          <title>{term}</title>
        </Helmet>
        <div style={{ display: `${isTerminal ? "block" : "none"}` }}>
          {isHistory ? (
            <div
              className={`ctrl-item foreground-change ${
                gradient ? "" : "no-gradient"
              }`}
            >
              {isHistory === 1 ? "History" : "Bookmark"}
            </div>
          ) : null}

          <Terminal
            identifier={identifier}
            commands={commands}
            term={term}
            setIsTaskbar={setIsTaskbarEdit}
            altNewtab={altNewtab}
            ref={terminal}
            onChange={(input) => {
              setTerm(input);
              setIsTerminal(!!input);
            }}
          />

          <div style={{ marginTop: "50px" }} className="search-results">
            {results
              .filter((e) => !!e)
              .map((e, i) => {
                return (
                  <SearchResults
                    onClick={() => {
                      if (typeof e.url === "string") {
                        if (!altNewtab) window.open(e.url);
                        else document.location = e.url;
                      } else {
                        e.url(altNewtab);
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
  return (
    <React.Fragment>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <div
          style={{
            marginLeft: isParallex ? `${parallex.x * parallexFactor}vw` : "0",
            marginTop: isParallex ? `${parallex.y * parallexFactor}vh` : "0",
            color: foreground,
            transform: isParallex ? `scale(${1 + parallexFactor / 100})` : null,
            background: background || "#333",
            filter: `blur(${
              isTaskbarEdit
                ? blur.setting
                : isTerminal
                ? blur.terminal
                : blur.notTerminal
            }px) brightness(${
              isTaskbarEdit
                ? brightness.setting
                : isTerminal
                ? brightness.terminal
                : brightness.notTerminal
            })`,
          }}
          className={`background ${isTerminal ? "isTerminal" : ""} ${
            gradient ? "" : "no-gradient"
          } ${isTaskbarEdit ? "super-blured" : ""}`}
        />
      </div>

      <div className="keepcentered" style={{ fontFamily: `${font}, IranSans` }}>
        {isTerminal ? renderedTerminal() : renderedNoTerminal()}
      </div>
    </React.Fragment>
  );
};

export default App;
