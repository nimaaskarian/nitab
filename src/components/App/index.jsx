import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import {
  setTerm,
  toggleEnterOpensNewtab,
  circleSearchMode,
} from "store/actions";

import AddTaskbar from "../AddTaskbar";
import Terminal from "../Terminal";
import Clock from "../Clock";
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

  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const foreground = useSelector(({ data }) => data.theme.foreground);
  const font = useSelector(({ data }) => data.theme.font);

  const clockEnabled = useSelector(({ data }) => data.clock.enabled);
  const identifier = useSelector(({ data }) => data.terminal.identifier);
  const searchMode = useSelector(({ data }) => data.terminal.searchMode);

  useAlert({ isTerminal });
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
        dispatch(toggleEnterOpensNewtab());
      }
      if (e.ctrlKey && e.code === "KeyQ") dispatch(circleSearchMode());

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
        setIsTerminal(true);
        terminal.current.focus();
      } else {
        e.preventDefault();
      }
    };
    if (!isTaskbarEdit) window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isTerminal, searchMode, isTaskbarEdit]);

  useEffect(() => {
    if (isTaskbarEdit) dispatch(setTerm(""));
  }, [isTaskbarEdit]);

  const RenderedContent = () => {
    if (!isTerminal)
      return (
        <React.Fragment>
          {isTaskbarEdit ? (
            <AddTaskbar />
          ) : isDragAccept ? (
            <h1>Drop the picture...</h1>
          ) : (
            <Clock />
          )}
          <Taskbar />
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <SearchMode isHistory={searchMode} />
        <CommandsContext.Provider value={{ commands }}>
          <Terminal ref={terminal} />
        </CommandsContext.Provider>

        <SearchResultList commands={commands} />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <ImageDropzone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />
      <Helmet>
        <title>{identifier}Niotab</title>
      </Helmet>
      <Background isTerminal={isTerminal} />

      <AppContainer color={foreground.color} font={font}>
        <RenderedContent />
      </AppContainer>
    </React.Fragment>
  );
};

export default App;
