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
  TerminalDiv,
  TerminalAutoCompleteWrapper,
} from "./style";

const Terminal = React.forwardRef((props, forwardedRef) => {
  const { commands } = useContext(CommandsContext);
  const dispatch = useDispatch();
  const identifier = useSelector(({ data }) => data.identifier);
  const altNewtab = useSelector(({ data }) => data.altNewtab);
  const { color, isOvr } = useSelector(({ data }) => data.foreground);

  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const currentCommand = useMemo(() => {
    const { name, args } = termToCommand(term, identifier, commands);
    return { ...commands[name], args };
  }, [term, identifier, commands]);
  console.error("SEX",currentCommand);
  const tempColor = useSelector(({ ui }) => ui.tempColor);
  const tempIcon = useSelector(({ ui }) => ui.tempIcon);

  const currentColor = useMemo(() => {
    return isOvr ? color : currentCommand.color;
  }, [isOvr, color, currentCommand.color]);

  const handleSubmit = useCallback(
    (e) => {
      let onSubmit;
      try {
        onSubmit = currentCommand.function(currentCommand.args);
      } catch (error) {
      }
      // const { args } = currentCommand;
      if (e.code === "Enter" && onSubmit) {
        let _output = onSubmit();
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
  return (
    <TerminalDiv
      isRtl={/^[\u0600-\u06FF\s]+/.test(term)}
      color={tempColor || currentColor}
    >
      <TerminalAutoCompleteWrapper>
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
      </TerminalAutoCompleteWrapper>
      <TerminalOutput
        className={tempIcon || currentCommand.icon || "fal fa-terminal"}
      />
    </TerminalDiv>
  );
});

export default Terminal;
