import React, { useEffect, useMemo, useContext, useState } from "react";
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
  // const [scrollLeft, setScrollLeft] = useState(
  //   forwardedRef.current?.scrollLeft || 0
  // );
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

  useEffect(() => {
    const handleSubmit = (e) => {
      if (e.code !== "Enter" || !currentCommand.function) return;
      const onSubmit = currentCommand.function(currentCommand.args)();
      const altKey = e.altKey === enterOpensNewtab;
      if (typeof onSubmit === "string") {
        console.log(altKey);
        window.document.title = `${term} - ${identifier}Niotab`;
        history.push({ search: "?t=" + term });
        if (altKey) document.location = onSubmit;
        else {
          window.open(onSubmit);
        }
      } else {
        onSubmit({
          altKey,
        });
      }
      return true;
    };
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    };
  }, [currentCommand, enterOpensNewtab, identifier, term]);

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
          // onScroll={() => setScrollLeft(forwardedRef.current?.scrollLeft)}
          autoFocus
          onChange={(e) => dispatch(setTerm(e.target.value.trimStart()))}
        />
        <CurrentColorContext.Provider
          value={[currentColor, color, isOvr, isDark]}
        >
          <CurrentCommandContext.Provider value={currentCommand}>
            <Autocomplete isRtl={isRtl} /*scrollLeft={scrollLeft}*/ />
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
