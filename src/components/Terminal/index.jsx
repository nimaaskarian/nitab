import React, { useEffect, useMemo, useCallback, useContext } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import history from "js/history";
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

const Terminal = React.forwardRef((props, forwardedRef) => {
  const commands = useContext(CommandsContext);
  const defaultIcon = useSelector(({ ui }) => ui.defaultIcon);
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
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    };
  }, [handleSubmit]);
  return (
    <StyledTerminal
      isRtl={/^[\u0600-\u06FF\s]+/.test(term)}
      color={currentColor}
    >
      <SearchMode />
      <TerminalAutoCompleteWrapper>
        <TerminalInput
          value={term}
          ref={forwardedRef}
          autoFocus
          onChange={(e) => {
            dispatch(setTerm(e.target.value.trimStart()));
          }}
        />
        <CurrentColorContext.Provider value={currentColor}>
          <CurrentCommandContext.Provider value={currentCommand}>
            <Autocomplete />
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
