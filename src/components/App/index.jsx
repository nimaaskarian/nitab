import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import {
  setTerm,
  toggleEnterOpensNewtab,
  circleSearchMode,
  setCurrentBackground,
  setCurrentTheme,
} from "store/actions";

import Terminal from "../Terminal";
import Taskbar from "../Taskbar";
import Background from "../Background";
import ImageDropzone from "../ImageDropzone";
import useCommands from "hooks/useCommands";
import useIsTermEmpty from "hooks/useIsTermEmpty";
import useAlert from "hooks/useAlert";

import mutedKeys, {
  ctrlShiftMuted,
  termEmptyMuted,
} from "services/Lists/mutedKeys";

import CommandsContext from "context/CommandsContext";

import { AppContainer, MainAndTaskbarWrapper } from "./style";
import Main from "components/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useIsThemeDark from "hooks/useIsThemeDark";
const App = () => {
  //bookmark === 0, history === 1, nothing === 0
  console.log("rerender");
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
  const darkIndex = useSelector(({ data: { themes } }) => themes.dark);
  const lightIndex = useSelector(({ data: { themes } }) => themes.light);

  const isDarkTheme = useIsThemeDark();
  const identifier = useSelector(({ data }) => data.terminal.identifier);

  useAlert({ isTerminal });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(darkIndex, lightIndex, isDarkTheme);
    if (darkIndex !== -1 && isDarkTheme) dispatch(setCurrentTheme(darkIndex));

    if (lightIndex !== -1 && !isDarkTheme)
      dispatch(setCurrentTheme(lightIndex));
  }, [isDarkTheme, darkIndex, lightIndex]);

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
        mutedKeys.includes(e.code) ||
        (ctrlShiftMuted.includes(e.code) && e.ctrlKey && e.shiftKey) ||
        (termEmptyMuted.includes(e.code) && isTermEmpty)
      )
        return;

      e.stopPropagation();

      if (e.altKey || e.ctrlKey)
        switch (e.code) {
          case "KeyQ":
            return dispatch(circleSearchMode());
          case "KeyB":
            return dispatch(toggleEnterOpensNewtab());
          default:
            break;
        }

      if (e.key === "Escape") {
        setIsTerminal(false);
        return;
      }

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
  }, [isTaskbarEdit, isTermEmpty]);

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
