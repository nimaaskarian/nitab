import React, { useEffect, useMemo, useCallback, useContext } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import history from "js/history";
import Autocomplete from "../Autocomplete";
import { termToCommand } from "services/Commands/index.js";
import { setTerm } from "store/actions";
import CurrentCommandContext from "context/CurrentCommandContext";
import "./style.css";
import CommandsContext from "context/CommandsContext";
import {
  TerminalInput,
  TerminalOutput,
  TerminalInputWrapper,
  TerminalDiv,
} from "./style";

const Terminal = React.forwardRef((props, forwardedRef) => {
  const { commands, commandIcons } = useContext(CommandsContext);
  const dispatch = useDispatch();
  const identifier = useSelector(({ data }) => data.identifier);
  const altNewtab = useSelector(({ data }) => data.altNewtab);
  const term = useSelector(({ ui }) => ui.term, shallowEqual);

  const currentCommand = useMemo(() => {
    return termToCommand(term, identifier, commands);
  }, [term, identifier, commands]);

  const termClass = useCallback(() => {
    const { name } = currentCommand;
    return ["taskbar", "command"].includes(name)
      ? {}
      : { icons: commandIcons[name], commandColorVariableName: name };
  }, [currentCommand, commandIcons]);
  const handleSubmit = useCallback(
    (e) => {
      let onSubmit;
      try {
        onSubmit = commands[currentCommand.name](currentCommand.args);
      } catch (error) {}
      const { args } = currentCommand;
      if (e.code === "Enter" && onSubmit) {
        let _output = onSubmit(args);
        if (typeof _output === "string") {
          window.document.title = `${term} - ${
            identifier === "NONE" ? "" : identifier
          }Niotab`;
          history.push({ search: "?t=" + term });
          if (e.altKey !== altNewtab) document.location = _output;
          else {
            window.open(_output);
          }
        } else {
          _output({
            altKey: e.altKey !== altNewtab,
          });
        }
      }
    },
    [altNewtab, currentCommand, identifier, term, commands]
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
  const { commandColorVariableName, icons } = termClass();
  return (
    <TerminalDiv isRtl={/^[\u0600-\u06FF\s]+/.test(term)}>
      <TerminalInputWrapper
        color={getComputedStyle(document.documentElement).getPropertyValue(
          `--${commandColorVariableName}`
        )}
      >
        <TerminalInput
          value={term}
          ref={forwardedRef}
          autoFocus
          onChange={(e) => {
            dispatch(setTerm(e.target.value.trimStart()));
          }}
        />
        <CurrentCommandContext.Provider value={currentCommand}>
          <Autocomplete />
        </CurrentCommandContext.Provider>
      </TerminalInputWrapper>
      <TerminalOutput className={`${icons || "fontawe"}`} />
    </TerminalDiv>
  );
});

export default Terminal;
