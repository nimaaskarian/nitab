import React, { useEffect, useMemo, useCallback, useContext } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import history from "services/history";
import Autocomplete from "../AutocompleteList";
import { termToCommand } from "services/Commands/index.js";
import { setTerm } from "store/actions";

import CurrentCommandContext from "context/CurrentCommandContext";
import CommandsContext from "context/CommandsContext";
import {
  TerminalInput,
  TerminalOutput,
  StyledTerminal,
  TerminalAutoCompleteWrapper,
} from "./style";
import CurrentColorContext from "context/CurrentColorContext";
import SearchResultList from "components/SearchResultList";
import SearchMode from "components/SearchMode";
import useIsDarkColor from "hooks/useIsDarkColor";

const Terminal = React.forwardRef((props, forwardedRef) => {
  const commands = useContext(CommandsContext);
  const defaultIcon = useSelector(({ data }) => data.terminal.defaultIcon);
  const dispatch = useDispatch();
  const identifier = useSelector(({ data }) => data.terminal.identifier);
  const tempIcon = useSelector(({ ui }) => ui.tempIcon);

  const enterOpensNewtab = useSelector(
    ({ data }) => data.terminal.enterOpensNewtab
  );
  const { color, isOvr } = useSelector(
    ({
      data: {
        themes: { current, list },
      },
    }) => list[current].foreground
  );

  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const currentCommand = useMemo(() => {
    const { name, args } = termToCommand(term, identifier, commands);
    return { ...commands[name], args, name };
  }, [term, identifier, commands]);
  const currentColor = useMemo(() => {
    return isOvr ? color : currentCommand.color || color;
  }, [isOvr, color, currentCommand.color]);
  const isDark = useIsDarkColor(currentColor);
  const handleSubmit = useCallback(
    (e) => {
      if (e.code !== "Enter") return;
      let onSubmit = currentCommand.function(currentCommand.args)();
      if (typeof onSubmit === "string") {
        window.document.title = `${term} - ${identifier}Niotab`;
        history.push({ search: "?t=" + term });
        if (e.altKey === enterOpensNewtab) document.location = onSubmit;
        else {
          window.open(onSubmit);
        }
      } else {
        onSubmit({
          altKey: e.altKey === enterOpensNewtab,
        });
      }
    },
    [currentCommand, term, identifier, enterOpensNewtab]
  );
  useEffect(() => {
    const isSelfSubmit =
      new URLSearchParams(window.location.search).get("selfSubmit") === "true";
    if (isSelfSubmit) {
      handleSubmit({ code: "Enter" });
    }
    return () => {
      const abortController = new AbortController();
      abortController.abort();
    };
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    };
  }, [handleSubmit]);

  const isRtl = useMemo(
    () =>
      (forwardedRef.current &&
        window.getComputedStyle(forwardedRef.current, null).direction ===
          "rtl") ??
      false,
    [forwardedRef]
  );
  return (
    <StyledTerminal color={currentColor} isDark={isDark}>
      <SearchMode />
      <TerminalAutoCompleteWrapper>
        <TerminalInput
          dir="auto"
          value={term}
          ref={forwardedRef}
          autoFocus
          onChange={(e) => {
            dispatch(setTerm(e.target.value.trimStart()));
          }}
        />
        <CurrentColorContext.Provider value={[currentColor, color, isOvr]}>
          <CurrentCommandContext.Provider value={currentCommand}>
            <Autocomplete isRtl={isRtl} />
          </CurrentCommandContext.Provider>
        </CurrentColorContext.Provider>
      </TerminalAutoCompleteWrapper>
      <TerminalOutput
        className={tempIcon || currentCommand.icon || defaultIcon}
      />
      <SearchResultList
        term={term}
        currentCommand={currentCommand}
        searchCommand={commands.search}
      />
    </StyledTerminal>
  );
});

export default Terminal;
