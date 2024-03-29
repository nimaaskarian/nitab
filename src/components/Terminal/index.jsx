import React, { useEffect, useMemo, useContext, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import usePushHistory from "hooks/usePushHistory";

const Terminal = React.forwardRef((props, forwardedRef) => {
  const pushHistory = usePushHistory()
  const commands = useContext(CommandsContext);
  const defaultIcon = useSelector(({ data }) => data.terminal.defaultIcon);
  const dispatch = useDispatch();
  const identifier = useSelector(({ data }) => data.terminal.identifier);
  const tempIcon = useSelector(({ ui }) => ui.tempIcon);
  const [scrollLeft, setScrollLeft] = useState(
    forwardedRef.current?.scrollLeft || 0
  );
  const enterOpensNewtabDefault = useSelector(
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

  const [selection, setSelection] = useState()

  useEffect(() => {
    const handleSubmit = (e) => {
      const { start, end } = selection;
      const length = term.length;
      if (e.ctrlKey) {
        console.log("works")
        switch (e.code) {
          case "KeyU":
            e.preventDefault()
            dispatch(setTerm(""))
            break;
          case "KeyH":
            e.preventDefault()
            if (e.shiftKey) {
              forwardedRef.current.setSelectionRange(start ? start - 1 : start, end)
            } else {
              if (start !== end) forwardedRef.current.setSelectionRange(start, start)
              else
                forwardedRef.current.setSelectionRange(start ? start - 1 : start, end ? end - 1 : end)
            }
            break;
          case "KeyL":
            e.preventDefault()
            if (e.shiftKey) {
              forwardedRef.current.setSelectionRange(start, end === length ? end : end + 1)
            } else {
              if (start !== end) forwardedRef.current.setSelectionRange(end, end)
              else
                forwardedRef.current.setSelectionRange(start === length ? start : start + 1, end === length ? end : end + 1)
            }
            break;
          default:
            break;
        }
      }
      if (e.code !== "Enter" || !currentCommand.function) return;
      const onSubmit = currentCommand.function(currentCommand.args)();
      const willOpenInNewtab = e.altKey !== enterOpensNewtabDefault;
      pushHistory()
      if (typeof onSubmit === "string") {
        if (willOpenInNewtab) window.open(onSubmit);
        else {
          document.location = onSubmit;
        }
      } else {
        onSubmit(
          willOpenInNewtab,
        );
      }
      return true;
    };
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    };
  }, [currentCommand, enterOpensNewtabDefault, identifier, term, selection]);

  const isRtl = (forwardedRef.current &&
    window.getComputedStyle(forwardedRef.current, null).direction ===
    "rtl") ?? false
  const handleSelection = () => {
    const start = forwardedRef.current.selectionStart;
    const end = forwardedRef.current.selectionEnd;
    if (selection?.end !== end || selection?.start !== start)
      setSelection({ start, end });
  }
  return (
    <StyledTerminal color={currentColor} isDark={isDark}>
      <SearchMode />
      <TerminalAutoCompleteWrapper>
        <TerminalInput
          onSelect={handleSelection}
          onKeyDown={handleSelection}
          dir="auto"
          value={term}
          ref={forwardedRef}
          onScroll={() => setScrollLeft(forwardedRef.current?.scrollLeft)}
          autoFocus
          onChange={(e) => dispatch(setTerm(e.target.value.trimStart()))}
        />
        <CurrentColorContext.Provider
          value={[currentColor, color, isOvr, isDark]}
        >
          <CurrentCommandContext.Provider value={currentCommand}>
            <Autocomplete isRtl={isRtl} scrollLeft={scrollLeft} />
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
