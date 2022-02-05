import React, { useRef, useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import AddTaskbar from "./AddTaskbar";
import Terminal from "./Terminal";
import Clock from "./Clock";
import Timer from "./Timer";
import SearchResultList from "./SearchResultList";

import {
  setTerm,
  toggleAltNewtab,
  addIsHistory,
} from "../actions";

import useCommands from "../hooks/useCommands";
import useIsTermEmpty from "../hooks/useIsTermEmpty";
import { setBackground, mutedKeys } from "../utils";
import onForegroundChange from "../utils/onForegroundChange";

import "../css/App.css";
import "../css/fa.css";
import Taskbar from "./Taskbar";
import Background from "./Background";
import ImageDropzone from "./ImageDropzone";
import useImageDrop from "../hooks/useImageDrop";
import Alert from "./Alert";

const App = () => {
  //bookmark === 0, history === 1, nothing === 0
  const { commands, icons: commandIcons } = useCommands();
  const isTermEmpty = useIsTermEmpty();
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const { isDragAccept, getRootProps, getInputProps } = useImageDrop();
  const terminal = useRef();
  const timerEditFocus = useSelector(({ ui }) => ui.timerEditFocus);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const foreground = useSelector(({ data }) => data.foreground);
  const isHistory = useSelector(({ data }) => data.isHistory);
  const isClock = useSelector(({ data }) => data.isClock);
  const gradient = useSelector(({ data }) => data.gradient);
  const identifier = useSelector(({ data }) => data.identifier);
  const font = useSelector(({ data }) => data.font);

  const dispatch = useDispatch();
  Alert();
  useEffect(() => {
    setIsTerminal(!isTermEmpty);
  }, [isTermEmpty]);

  useEffect(() => {
    setBackground();
    dispatch(
      setTerm(new URLSearchParams(window.location.search).get("t") || "")
    );
  }, []);
  useEffect(() => {
    const _styleIndex = document.styleSheets.length - 1;
    onForegroundChange(document.styleSheets[_styleIndex], foreground);
    return () => {
      document.styleSheets[_styleIndex].deleteRule(
        document.styleSheets[_styleIndex].cssRules.length - 2
      );
      document.styleSheets[_styleIndex].deleteRule(
        document.styleSheets[_styleIndex].cssRules.length - 1
      );
    };
  }, [foreground]);

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
        dispatch(toggleAltNewtab());
      }
      if (e.ctrlKey && e.code === "KeyQ") dispatch(addIsHistory());

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
        if (!timerEditFocus) {
          setIsTerminal(true);
          terminal.current.focus();
        }
      } else {
        e.preventDefault();
      }
    };
    if (!isTaskbarEdit) window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isTerminal, isHistory, isTaskbarEdit, timerEditFocus]);

  useEffect(() => {
    if (isTaskbarEdit) dispatch(setTerm(""));
  }, [isTaskbarEdit]);

  const RenderedContent = useCallback(() => {
    if (!isTerminal)
      return (
        <React.Fragment>
          <ImageDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />

          {isTaskbarEdit ? (
            <AddTaskbar />
          ) : isDragAccept ? (
            <h1 className="foreground-change">Drop the picture...</h1>
          ) : isClock ? (
            <Clock />
          ) : (
            <Timer />
          )}
          <Taskbar />
        </React.Fragment>
      );
    return (
      <div>
        {isHistory ? (
          <div
            className={`search-mode foreground-change ${
              gradient ? "" : "no-gradient"
            }`}
          >
            {["History", "Bookmark", "Tabs"][isHistory - 1]}
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
    gradient,
    isClock,
    isHistory,
    isTaskbarEdit,
  ]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{identifier === "NONE" ? "" : identifier}Niotab</title>
      </Helmet>
      <Background isTerminal={isTerminal} />

      <div
        className={`keepcentered ${isTerminal ? "" : "no-terminal"}`}
        style={{ fontFamily: `${font}, IranSans` }}
      >
        <RenderedContent />
      </div>
    </React.Fragment>
  );
};

export default App;
