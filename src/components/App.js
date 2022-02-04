/*global chrome*/
/*global browser*/

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useAlert } from "react-alert";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import AddTaskbar from "./AddTaskbar";
import Terminal from "./Terminal";
import Clock from "./Clock";
import Timer from "./Timer";
import TaskbarIcon from "./TaskbarIcon";

import {
  isDark,
  getImageLightness,
  setBackground,
  mutedKeys,
  useDidMountEffect,
} from "../utils";
import { unsplash } from "../apis";
import * as actions from "../actions";
import "../css/App.css";
import "../css/fa.css";
import SearchResultList from "./SearchResultList";
import useCommands from "../hooks/useCommands";
import useIsTermEmpty from "../hooks/useIsTermEmpty";

const App = (props) => {
  //bookmark === 0, history === 1, nothing === 0
  const { commands, icons: commandIcons } = useCommands();
  const isTermEmpty = useIsTermEmpty();
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const [addtaskbarIndex, setAddtaskbarIndex] = useState(null);
  const [prevCommands, setPrevCommands] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
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
  useEffect(() => {
    setIsTerminal(!isTermEmpty)
  }, [isTermEmpty]);
  
  const onDropAccepted = useCallback((files) => {
    alert.show(
      <div className="alert">
        {files[0].name} has been set as your background picture
      </div>
    );
    const bgBlob = new Blob([files[0]], { type: "image/*" });
    setBackground(bgBlob);
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
    if (!prevCommands) setPrevCommands({ ...props.commands });
    return () => {
      if (typeof props.commands === "object")
        setPrevCommands({ ...props.commands });
    };
  }, [props.commands]);
  useEffect(() => {
    if (prevCommands) {
      let updates = [];
      Object.keys(prevCommands).forEach((key) => {
        if (!props.commands.hasOwnProperty(key))
          updates.push({ key, type: "delete" });
      });
      Object.keys(props.commands).forEach((key) => {
        if (!prevCommands.hasOwnProperty(key))
          updates.push({ key, type: "add" });
      });
      updates.forEach((e) => {
        alert.show(
          <div className="alert">
            {e.type === "add"
              ? `You've added "${e.key}" to your commands`
              : `You've deleted "${e.key}" from your commands`}
          </div>
        );
      });
    }
  }, [prevCommands]);
  useEffect(() => {
    if (props.background === "unsplash") {
      unsplash
        .get("/random", {
          params: {
            collections: props.unsplashCollections,
          },
        })
        .then(async ({ data }) => {
          const blob = await fetch(data.urls.full).then((r) => r.blob());
          setBackground(blob);
        });
    }
  }, [props.background]);
  useEffect(() => {
    const mouseOver = (e) => {
      const x = 0.5 - Math.round((e.clientX / window.innerWidth) * 10) / 10;
      const y = 0.5 - Math.round((e.clientY / window.innerHeight) * 10) / 10;
      setParallax({ x, y });
    };
    if (props.isParallax) window.addEventListener("mousemove", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseOver);
    };
  }, [props.isParallax]);
  useEffect(() => {
    alert.removeAll();
    props.todo.forEach((e, i) => {
      alert.show(
        <div
          style={{
            direction: `${/^[\u0600-\u06FF\s]+/.test(e) ? "rtl" : "ltr"}`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="alert"
        >
          <div>{e}</div>
          <a
            style={{ marginLeft: "5px", cursor: "pointer" }}
            className="fal fa-circle"
            onClick={async (e) => {
              e.target.className = "fal fa-check-circle";
              setTimeout(() => {
                props.removeTodo(i);
              }, 350);
            }}
          />
        </div>,
        { timeout: 0 }
      );
    });
  }, [props.todo]);
  useEffect(() => {
    setBackground();
    props.setTerm(new URLSearchParams(window.location.search).get("t") || "");
    document.addEventListener("reset", props.resetStorage, false);
    return () => document.removeEventListener("reset", props.resetStorage);
  }, []);
  useEffect(() => {
    const _styleIndex = document.styleSheets.length - 1;
    onForegroundChange(document.styleSheets[_styleIndex], props.foreground);
    return () => {
      document.styleSheets[_styleIndex].deleteRule(
        document.styleSheets[_styleIndex].cssRules.length - 2
      );
      document.styleSheets[_styleIndex].deleteRule(
        document.styleSheets[_styleIndex].cssRules.length - 1
      );
    };
  }, [props.foreground]);
  useEffect(() => {
    if (props.background && props.isForegroundAuto) {
      getImageLightness(
        props.background
          .replace(/^url\('|^url\("/g, "")
          .replace(/"\)|'\)/g, ""),
        (br) => {
          if (br !== null)
            props.setForeground(
              `rgb(${br < 127.5 ? 255 : 0},${br < 127.5 ? 255 : 0},${
                br < 127.5 ? 255 : 0
              })`
            );
          else
            props.setForeground(
              `rgb(${isDark(props.background) ? 255 : 0},${
                isDark(props.background) ? 255 : 0
              },${isDark(props.background) ? 255 : 0})`
            );
        }
      );
    }
  }, [props.background, props.isForegroundAuto]);
  useEffect(() => {
    const onKeydown = (e) => {
      if (
        mutedKeys.includes(e.key) ||
        (e.code === "Space" && isTermEmpty) ||
        (e.code === "KeyI" && e.ctrlKey && e.shiftKey) ||
        (e.code === "KeyC" && e.ctrlKey && e.shiftKey)
      )
        return;
      e.stopPropagation();
      if (e.ctrlKey && e.code === "KeyB") {
        props.toggleAltNewtab();
      }
      if (e.ctrlKey && e.code === "KeyQ") props.addIsHistory();

      if (e.key === "Escape") {
        setIsTerminal(false);
        return;
      }
      if (e.altKey && +e.code.replace(/(Digit)|(Numpad)/, "")) {
        if (isTerminal)
          try {
            document
              .querySelectorAll(".search-result")
              [+e.code.replace(/(Digit)|(Numpad)/, "") - 1].click();
            return;
          } catch (error) {}
        else
          try {
            document
              .querySelectorAll(".taskbar-icon:not(.empty)")
              [+e.code.replace(/(Digit)|(Numpad)/, "") - 1].click();
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
      if (e.key === "Backspace" && isTermEmpty) return;
      if (!e.altKey) {
        if (!props.timerEditFocus) {
          setIsTerminal(true);
          terminal.current.focus();
        }
      } else {
        e.preventDefault();
      }
    };
    if (!props.isTaskbarEdit) window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isTerminal, props.isHistory, props.isTaskbarEdit, props.timerEditFocus]);

  useDidMountEffect(() => {
    alert.show(
      <div className="alert">
        {props.altNewtab
          ? "Default enter behaviour is now current tab"
          : "Default enter behaviour is now new tab"}
      </div>
    );
  }, [props.altNewtab]);
  useEffect(() => {
    if (props.isTaskbarEdit) props.setTerm("");
  }, [props.isTaskbarEdit]);
  const onTaskbarMouseMove = (e) => {
    if (!props.isTaskbarEdit && props.magnify)
      document.querySelectorAll(".taskbar-icon:not(.empty)").forEach((i) => {
        const { left } = i.getBoundingClientRect();
        let distance = Math.abs(e.clientX - left - i.offsetWidth / 2) / 30;
        if (distance <= 1) distance = 0.6;

        i.style.fontSize = parseInt((35 + 6.5 / distance) * 10) / 10 + "px";
      });
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
        </div>

        {props.isTaskbarEdit ? (
          <AddTaskbar
            selectedIndex={addtaskbarIndex}
            onIndexChange={() => setAddtaskbarIndex(null)}
          />
        ) : isDragActive && isDragAccept ? (
          <h1 className="foreground-change">Drop the picture...</h1>
        ) : props.isClock ? (
          <Clock />
        ) : (
          <Timer />
        )}
        {props.taskbarIcons.length ? (
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
                    e.icon === "empty" && props.isTaskbarEdit
                      ? "rgba(87, 87, 87, 0.36)"
                      : null
                  }
                  index={e.index}
                  color={e.color}
                  isBlank={!props.altNewtab}
                  icon={e.icon}
                  url={props.isTaskbarEdit ? "" : e.url}
                  onDblClick={() => props.deleteTaskbarIcon(i)}
                />
              );
            })}
          </div>
        ) : null}
      </React.Fragment>
    );
  };
  const renderedTerminal = () => {
    return (
      <React.Fragment>
        <div style={{ display: `${isTerminal ? "block" : "none"}` }}>
          {props.isHistory ? (
            <div
              className={`search-mode foreground-change ${
                props.gradient ? "" : "no-gradient"
              }`}
            >
              {(() => {
                switch (props.isHistory) {
                  case 1:
                    return "History";
                  case 2:
                    return "Bookmark";
                  case 3:
                    return "Tabs";
                  default:
                    break;
                }
              })()}
            </div>
          ) : null}

          <Terminal
            ref={terminal}
            commands={commands}
            commandIcons={commandIcons}
          />

          <SearchResultList commands={commands} />
        </div>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <Helmet>
        <title>
          {props.identifier === "NONE" ? "" : props.identifier}Niotab
        </title>
      </Helmet>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <div
          style={{
            marginLeft: props.isParallax
              ? `${parallax.x * props.parallaxFactor}vw`
              : "0",
            marginTop: props.isParallax
              ? `${parallax.y * props.parallaxFactor}vh`
              : "0",
            transform: props.isParallax
              ? `scale(${1 + props.parallaxFactor / 100})`
              : null,
            background: props.background || "#222",
            filter: `blur(${
              props.isTaskbarEdit
                ? props.blur.setting
                : isTerminal
                ? props.blur.terminal
                : props.blur.notTerminal
            }px) brightness(${
              props.isTaskbarEdit
                ? props.brightness.setting
                : isTerminal
                ? props.brightness.terminal
                : props.brightness.notTerminal
            })`,
          }}
          className={`background ${isTerminal ? "isTerminal" : ""} ${
            props.gradient ? "" : "no-gradient"
          } ${props.isTaskbarEdit ? "super-blured" : ""}`}
        />
      </div>

      <div
        className={`keepcentered ${isTerminal ? "" : "no-terminal"}`}
        style={{ fontFamily: `${props.font}, IranSans` }}
      >
        {isTerminal ? renderedTerminal() : renderedNoTerminal()}
      </div>
    </React.Fragment>
  );
};
const mapStateToProp = ({ data, ui }) => {
  const { timerEditFocus, background, isTaskbarEdit } = ui;
  return {
    ...data,
    timerEditFocus,
    background,
    isTaskbarEdit,
  };
};
export default connect(mapStateToProp, actions)(App);
