import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";

import {
  setTerm,
  toggleEnterOpensNewtab,
  circleSearchMode,
  setCurrentBackground,
  setCurrentTheme,
  setSideMenuIndex,
} from "store/actions";

import Terminal from "../Terminal";
import Taskbar from "../Taskbar";
import Background from "../Background";
import Dropzone from "../Dropzone";
import useCommands from "hooks/useCommands";
import useAlert from "hooks/useAlert";

import mutedKeys, { termEmptyMuted } from "services/mutedKeys";

import CommandsContext from "context/CommandsContext";

import { AppContainer } from "./style";
import Main from "components/Main";
import useIsThemeDark from "hooks/useIsThemeDark";
import SideMenu from "components/SideMenu";
import useIsDarkColor from "hooks/useIsDarkColor";
import Visualizer from "components/Visualizer";

const App = () => {
  //bookmark === 0, history === 1, nothing === 0
  const commands = useCommands();
  const isTermEmpty = useSelector(({ ui }) => !ui.term);
  const [isTerminal, setIsTerminal] = useState(!isTermEmpty);
  const isBackgroundRandom = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].isBackgroundRandom
  );
  const isThemeRandom = useSelector(({ data }) => data.themes.isRandom);
  const terminal = useRef();

  const sideMenuIndex = useSelector(({ ui }) => ui.sideMenuIndex);
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
  const isDarkColor = useIsDarkColor(foreground.color);
  const identifier = useSelector(({ data }) => data.terminal.identifier);

  useAlert({ isTerminal });
  const dispatch = useDispatch();

  useEffect(() => {
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
    if (isBackgroundRandom) dispatch(setCurrentBackground("random"));
    if (isThemeRandom) dispatch(setCurrentTheme("random"));
  }, []);
  useEffect(() => {
    const onKeydown = (e) => {
      if (
        mutedKeys.includes(e.key) ||
        (e.ctrlKey && e.shiftKey) ||
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
      if (e.altKey || e.code === "Tab") {
        e.preventDefault();
      }
      if (e.code === "Escape") {
        setIsTerminal(false);

        if (!isTerminal) dispatch(setSideMenuIndex(5));

        return;
      }

      if (!e.altKey) {
        setIsTerminal(true);
        terminal.current.focus();
      }
    };
    if (!sideMenuIndex) window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [sideMenuIndex, isTermEmpty, isTerminal]);

  const RenderedContent = () => {
    if (!isTerminal)
      return (
        <>
          <Main />
          <Taskbar />
        </>
      );
    return (
      <CommandsContext.Provider value={commands}>
        <Terminal ref={terminal} />
      </CommandsContext.Provider>
    );
  };
  const [dragMessage, setDragMessage] = useState();
  return (
    <React.Fragment>
      <Dropzone setDragMessage={setDragMessage} />
      <Helmet>
        <title>{identifier}Niotab</title>
      </Helmet>
      <Background isTerminal={isTerminal} />
      {/* <Visualizer /> */}
      <AppContainer color={foreground.color} isDark={isDarkColor} font={font}>
        <SideMenu />
        {dragMessage ? <h1>{dragMessage}...</h1> : <RenderedContent />}
      </AppContainer>
    </React.Fragment>
  );
};

export default App;
