import React, { useRef, useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import { setTerm, toggleAltNewtab, addIsHistory } from "store/actions";

import AddTaskbar from "../AddTaskbar";
import Terminal from "../Terminal";
import Clock from "../Clock";
import Timer from "../Timer";
import Taskbar from "../Taskbar";
import Background from "../Background";
import ImageDropzone from "../ImageDropzone";
import SearchResultList from "../SearchResultList";
import SearchMode from "components/SearchMode";
import useCommands from "hooks/useCommands";
import useIsTermEmpty from "hooks/useIsTermEmpty";
import useImageDrop from "hooks/useImageDrop";
import useAlert from "hooks/useAlert";

import mutedKeys from "services/Lists/mutedKeys";
import setBackground from "services/Images/setBackground";

import CommandsContext from "context/CommandsContext";

import { AppContainer } from "./style";
const App = () => {
  //bookmark === 0, history === 1, nothing === 0
  const { commands } = useCommands();
  const isTermEmpty = useIsTermEmpty();
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const { isDragAccept, getRootProps, getInputProps } = useImageDrop();
  const terminal = useRef();
  const timerEditFocus = useSelector(({ ui }) => ui.timerEditFocus);
  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const foreground = useSelector(({ data }) => data.foreground);
  const isHistory = useSelector(({ data }) => data.isHistory);
  const isClock = useSelector(({ data }) => data.isClock);
  const identifier = useSelector(({ data }) => data.identifier);
  const font = useSelector(({ data }) => data.font);
  useAlert();
  const dispatch = useDispatch();
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

  const RenderedContent = () => {
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
            <h1>Drop the picture...</h1>
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
        <SearchMode isHistory={isHistory} />
        <CommandsContext.Provider value={{ commands }}>
          <Terminal ref={terminal} />
        </CommandsContext.Provider>

        <SearchResultList commands={commands} />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{identifier === "NONE" ? "" : identifier}Niotab</title>
      </Helmet>
      <Background isTerminal={isTerminal} />

      <AppContainer
        foreground={foreground}
        font={font}
        className={`foreground-change ${isTerminal ? "" : "no-terminal"}`}
      >
        <RenderedContent />
      </AppContainer>
    </React.Fragment>
  );
};

export default App;
