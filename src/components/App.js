import React, { useRef, useEffect, useState, useCallback } from "react";

import { connect } from "react-redux";
import Helmet from "react-helmet";

import AddTaskbar from "./AddTaskbar";
import Terminal from "./Terminal";
import Clock from "./Clock";
import Timer from "./Timer";
import SearchResultList from "./SearchResultList";

import { unsplash } from "../apis";
import * as actions from "../actions";

import useCommands from "../hooks/useCommands";
import useIsTermEmpty from "../hooks/useIsTermEmpty";
import { isDark, getImageLightness, setBackground, mutedKeys } from "../utils";
import onForegroundChange from "../utils/onForegroundChange";

import "../css/App.css";
import "../css/fa.css";
import Taskbar from "./Taskbar";
import Background from "./Background";
import ImageDropzone from "./ImageDropzone";
import useImageDrop from "../hooks/useImageDrop";
import Alert from "./Alert";

const App = (props) => {
  //bookmark === 0, history === 1, nothing === 0
  const { commands, icons: commandIcons } = useCommands();
  const isTermEmpty = useIsTermEmpty();
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const { isDragAccept, getRootProps, getInputProps } = useImageDrop();
  const terminal = useRef();
  Alert();
  useEffect(() => {
    setIsTerminal(!isTermEmpty);
  }, [isTermEmpty]);

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
    setBackground();
    props.setTerm(new URLSearchParams(window.location.search).get("t") || "");
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

  useEffect(() => {
    if (props.isTaskbarEdit) props.setTerm("");
  }, [props.isTaskbarEdit]);

  const RenderedContent = useCallback(() => {
    if (!isTerminal)
      return (
        <React.Fragment>
          <ImageDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />

          {props.isTaskbarEdit ? (
            <AddTaskbar />
          ) : isDragAccept ? (
            <h1 className="foreground-change">Drop the picture...</h1>
          ) : props.isClock ? (
            <Clock />
          ) : (
            <Timer />
          )}
          <Taskbar />
        </React.Fragment>
      );
    return (
      <div>
        {props.isHistory ? (
          <div
            className={`search-mode foreground-change ${
              props.gradient ? "" : "no-gradient"
            }`}
          >
            {["History", "Bookmark", "Tabs"][props.isHistory - 1]}
          </div>
        ) : null}

        <Terminal
          ref={terminal}
          commands={commands}
          commandIcons={commandIcons}
        />

        <SearchResultList commands={commands} />
      </div>
    );
  }, [
    commandIcons,
    commands,
    getInputProps,
    getRootProps,
    isDragAccept,
    isTerminal,
    props.gradient,
    props.isClock,
    props.isHistory,
    props.isTaskbarEdit,
  ]);

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {props.identifier === "NONE" ? "" : props.identifier}Niotab
        </title>
      </Helmet>
      <Background isTerminal={isTerminal} />

      <div
        className={`keepcentered ${isTerminal ? "" : "no-terminal"}`}
        style={{ fontFamily: `${props.font}, IranSans` }}
      >
        <RenderedContent />
      </div>
    </React.Fragment>
  );
};
const mapStateToProp = ({ data, ui }) => {
  const { timerEditFocus, isTaskbarEdit } = ui;
  return {
    ...data,
    timerEditFocus,
    isTaskbarEdit,
  };
};
export default connect(mapStateToProp, actions)(App);
