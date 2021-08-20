/*global chrome*/
import React, { useRef, useEffect, useState, useCallback } from "react";

import { useAlert } from "react-alert";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { isDark } from "../js/isdark-min";
import localforage from "localforage";
import "localforage-observable/dist/localforage-observable.es6";
import AddTaskbar from "./AddTaskbar";
import Terminal from "./Terminal";
import Clock from "./Clock";
import SearchResult from "./SearchResult";
import TaskbarIcon from "./TaskbarIcon";
import defaultCommands, { termToCommand } from "../js/commands";
import { connect } from "react-redux";

const App = (props) => {
  const [results, setResults] = useState([]);
  //bookmark === 0, history === 1, nothing === 0
  const [isTerminal, setIsTerminal] = useState(false);

  const [isTaskbarEdit, setIsTaskbarEdit] = useState(false);
  const [ac, setAc] = useState([]);
  const [term, setTerm] = useState("");
  const [addtaskbarIndex, setAddtaskbarIndex] = useState(null);
  const [parallex, setParallex] = useState({ x: 0, y: 0 });
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
    console.log(props.data);
  }, [props.data]);
  useEffect(() => {
    const mouseOver = (e) => {
      const x = 0.5 - Math.round((e.clientX / window.innerWidth) * 10) / 10;
      const y = 0.5 - Math.round((e.clientY / window.innerHeight) * 10) / 10;
      setParallex({ x, y });
    };
    if (props.isParallex) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [props.isParallex]);
  useEffect(() => {
    const myEventHandler = ({ ac }) => {
      setAc(ac);
    };
    document.addEventListener("autocomplete", myEventHandler, false);
    onForegroundChange(document.styleSheets[5], props.foreground);
  }, []);
  useEffect(() => {
    function getImageLightness(imageSrc, callback) {
      var img = document.createElement("img");
      img.src = imageSrc;
      img.style.display = "none";
      document.body.appendChild(img);

      var colorSum = 0;

      img.onload = function () {
        // create canvas
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var r, g, b, avg;

        for (var x = 0, len = data.length; x < len; x += 4) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];

          avg = Math.floor((r + g + b) / 3);
          colorSum += avg;
        }

        var brightness = Math.floor(colorSum / (this.width * this.height));
        callback(brightness);
      };
      callback(null);
    }
    if (props.background === "unsplash") {
      alert.show(
        <div className="alert">Your Unsplash image is loading...</div>
      );
      axios
        .get("https://api.unsplash.com/photos/random", {
          params: {
            collections: "9389477,908506,219941",
            client_id: "Oi5eeseZ0KatuzRuE5P1HFP7bk7UIUC-jIFXY5nS154",
          },
        })
        .then(async ({ data }) => {
          let blob = await fetch(data.urls.full).then((r) => r.blob());
          alert.show(
            <div className="alert">Your Unsplash image is loaded.</div>
          );
        });
    } else {
    }
  }, [props.background, props.isForegroundAuto]);
  useEffect(() => {
    const onKeydown = (e) => {
      if (e.code === "Space" && !term) return;
      e.stopPropagation();
      if (e.ctrlKey && e.code === "KeyB") {
        alert.show(
          <div className="alert">
            {props.altNewtab
              ? "Default enter behaviour is now new tab"
              : "Default enter behaviour is now current tab"}
          </div>
        );
        //setAltNewtab
      }
      if (e.ctrlKey && e.code === "KeyQ") {
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
  }, [isTerminal, props.isHistory, isTaskbarEdit]);

  useEffect(() => {
    const command = termToCommand(term, props.identifier, props.commands);
    let input;
    if (command.name && command.name !== "search") {
      if (props.commands[command.name](command.args))
        if (typeof props.commands[command.name](command.args)() === "string")
          input = props.commands[command.name](command.args)();
    }
    if (!input) input = term;
    const url =
      "https://duckduckgo.com/ac/?callback=autocompleteCallback&q=" + input;
    const script = document.createElement("script");
    script.src = url;
    let timeoutId, appended;
    if (term) {
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 250);

      chromeHistory(term);
    } else {
      setResults([]);
      setAc([]);
    }
    return () => {
      if (term) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [props.isHistory, term]);

  const chromeHistory = (term) => {
    const isNameSearch =
      termToCommand(term, props.identifier, props.commands).name === "search";
    const searchSuggest = (term) => {
      if (!isNameSearch)
        return {
          url: props.commands["search"](term)(),
          header: {
            className: "fontawe search",
          },
          title: term,
        };
    };
    const onSearchComplete = (e) => {
      setResults([searchSuggest(term), ...e]);
    };

    try {
      switch (props.isHistory) {
        case 2:
          chrome.bookmarks.search({ query: term }, (res) => {
            onSearchComplete(res.slice(0, 3 + isNameSearch));
          });
          break;
        case 1:
          chrome.history.search(
            {
              text: term,
              startTime: new Date().getTime() - 14 * 24 * 3600 * 1000,
              maxResults: 3 + isNameSearch,
            },
            (res) => {
              onSearchComplete(res);
            }
          );
          break;
        default:
          setResults([searchSuggest(term)]);
          break;
      }
    } catch (error) {
      
    }
  };
  useEffect(() => {
    if (isTaskbarEdit) {
      setIsTerminal(false);
      setTerm("");
    }
  }, [isTaskbarEdit]);
  const onTaskbarMouseMove = (e) => {
    if (!isTaskbarEdit && props.magnify)
      document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
        const { left } = i.getBoundingClientRect();
        let distance = Math.abs(e.clientX - left - i.offsetWidth / 2) / 30;
        if (distance < 1) distance = 1;

        i.style.fontSize = parseInt((35 + 17.5 / distance) * 10) / 10 + "px";
      });
  };
  const onAddtaskbarSubmit = ({ icon, color, url, index }) => {
    (async () => {
      // if (index === -1)
      // addTaskbarIcon({ icon, url, color, index: realIndex })
      // else {
      //   if (icon === "empty")
      //     editTaskbarIcon()
      //   else
      //    editEmptyTaskbarIcon()
      // }
    })();
  };
  const renderedNoTerminal = () => {
    return (
      <React.Fragment>
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
          <input {...getInputProps()} />
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
              taskbarIcons={props.taskbarIcons}
              selectedIndex={addtaskbarIndex}
              onIndexChange={() => setAddtaskbarIndex(null)}
            />
          ) : isDragActive && isDragAccept ? (
            <h1 className="foreground-change">Drop the picture...</h1>
          ) : (
            <Clock
              weatherData={props.weatherData}
              style={{
                position: props.clockPos !== "center" ? "absolute" : null,
                top: props.clockPos !== "center" ? "20px" : null,
                [props.clockPos]: "5vw",
                alignItems: props.clockAlign,
              }}
            />
          )}
          {props.taskbarIcons && props.taskbarIcons.length ? (
            <div
              className={`taskbar ${props.gradient ? "" : "no-gradient"}`}
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
              {props.taskbarIcons.map((e, i) => {
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
                    isBlank={!props.altNewtab}
                    icon={e.icon}
                    url={isTaskbarEdit ? "" : e.url}
                    onDblClick={(e) => {
                      //if (isTaskbarEdit) result.splice(i, 1);
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
        <div style={{ display: `${isTerminal ? "block" : "none"}` }}>
          {props.isHistory ? (
            <div
              className={`ctrl-item foreground-change ${
                props.gradient ? "" : "no-gradient"
              }`}
            >
              {(() => {
                switch (props.isHistory) {
                  case 1:
                    return "History";
                  case 2:
                    return "Bookmark";
                  default:
                    break;
                }
              })()}
            </div>
          ) : null}

          <Terminal
            ac={ac.filter((e) => e.phrase !== term).slice(0, 5)}
            identifier={props.identifier}
            commands={props.commands}
            term={term}
            setIsTaskbar={setIsTaskbarEdit}
            altNewtab={props.altNewtab}
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
                  <SearchResult
                    onClick={() => {
                      if (typeof e.url === "string") {
                        if (!props.altNewtab) window.open(e.url);
                        else document.location = e.url;
                      } else {
                        e.url(props.altNewtab);
                      }
                    }}
                    key={i}
                    header={{
                      text: e.title,
                      className: e.header ? e.header.className : "",
                    }}
                  >
                    {e.url}
                  </SearchResult>
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
            marginLeft: props.isParallex
              ? `${parallex.x * props.parallexFactor}vw`
              : "0",
            marginTop: props.isParallex
              ? `${parallex.y * props.parallexFactor}vh`
              : "0",
            transform: props.isParallex
              ? `scale(${1 + props.parallexFactor / 100})`
              : null,
            background: props.background || "#222",
            filter: `blur(${
              isTaskbarEdit
                ? props.blur.setting
                : isTerminal
                ? props.blur.terminal
                : props.blur.notTerminal
            }px) brightness(${
              isTaskbarEdit
                ? props.brightness.setting
                : isTerminal
                ? props.brightness.terminal
                : props.brightness.notTerminal
            })`,
          }}
          className={`background ${isTerminal ? "isTerminal" : ""} ${
            props.gradient ? "" : "no-gradient"
          } ${isTaskbarEdit ? "super-blured" : ""}`}
        />
      </div>

      <div
        className="keepcentered"
        style={{ fontFamily: `${props.font}, IranSans` }}
      >
        {isTerminal ? renderedTerminal() : renderedNoTerminal()}
      </div>
    </React.Fragment>
  );
};
const mapStateToProp = ({ data }, { commands }) => {
  const dataToCommand = (data) => {
    let temp = {};
    for (let command in data) {
      temp[command] = (input) => {
        if (data[command].length === 1)
          return () => {
            const [hasntInput, hasInput] = data[command][0]
              .replace("%input%", input)
              .split("%?%");
            if (hasInput) {
              if (input) return commands.url(hasInput)();
              return commands.url(hasntInput)();
            }
            return commands.url(hasntInput)();
          };
        else
          return () =>
            ({ input }) => {
              data[command].forEach((element) => {
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
    return temp;
  };
  return { ...data, commands: { ...defaultCommands, ...dataToCommand() } };
};
export default connect(mapStateToProp, {})(App);
