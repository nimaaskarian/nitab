import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import {
  setTerm,
  toggleEnterOpensNewtab,
  circleSearchMode,
  setCurrentBackground,
} from "store/actions";

import Terminal from "../Terminal";
import Taskbar from "../Taskbar";
import Background from "../Background";
import ImageDropzone from "../ImageDropzone";
import useCommands from "hooks/useCommands";
import useIsTermEmpty from "hooks/useIsTermEmpty";
import useAlert from "hooks/useAlert";

import mutedKeys from "services/Lists/mutedKeys";

import CommandsContext from "context/CommandsContext";

import { AppContainer, MainAndTaskbarWrapper } from "./style";
import Main from "components/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const App = () => {
  //bookmark === 0, history === 1, nothing === 0
  const commands = useCommands();
  const isTermEmpty = useIsTermEmpty();
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const isRandom = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].isBackgroundRandom
  );
  const terminal = useRef();

  const isTaskbarEdit = useSelector(({ ui }) => ui.isTaskbarEdit);
  const foreground = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );
  const font = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].font
  );

  const identifier = useSelector(({ data }) => data.terminal.identifier);

  useAlert({ isTerminal });
  const dispatch = useDispatch();
  useEffect(() => {
    setIsTerminal(!isTermEmpty);
  }, [isTermEmpty]);

  useEffect(() => {
    const termFromQuery = new URLSearchParams(window.location.search).get("t");
    if (termFromQuery) dispatch(setTerm(termFromQuery));
    if (isRandom) {
      dispatch(setCurrentBackground("random"));
    }
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
  }, [isTerminal, isTaskbarEdit]);

  useEffect(() => {
    if (isTaskbarEdit) dispatch(setTerm(""));
  }, [isTaskbarEdit]);

  const RenderedContent = () => {
    if (!isTerminal)
      return (
        <DndProvider backend={HTML5Backend}>
          <Main />
          <Taskbar />
        </DndProvider>
      );
    return (
      <CommandsContext.Provider value={commands}>
        <Terminal ref={terminal} />
      </CommandsContext.Provider>
    );
  };

  return (
    <React.Fragment>
      <ImageDropzone />
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
