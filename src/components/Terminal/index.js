import React, { useEffect, useMemo, useCallback, useContext } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import history from "js/history";
import Autocomplete from "../Autocomplete";
import { termToCommand } from "services/Commands/index.js";
import { setTerm } from "store/actions";
import CurrentCommandContext from "context/CurrentCommandContext";
import "./style.css";
import CommandsContext from "context/CommandsContext";
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
      : { icons: commandIcons[name], className: name };
  }, [currentCommand, commandIcons]);

  useEffect(() => {
    let onSubmit;
    try {
      onSubmit = commands[currentCommand.name](currentCommand.args);
    } catch (error) {}
    const onSubmitHelper = (e) => {
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
    };
    window.addEventListener("keydown", onSubmitHelper);
    return () => {
      window.removeEventListener("keydown", onSubmitHelper);
    };
  }, [currentCommand]);
  const { className, icons } = termClass();
  return (
    <div
      style={{
        direction: `${/^[\u0600-\u06FF\s]+/.test(term) ? "rtl" : "ltr"}`,
      }}
      className="terminal foreground-change"
    >
      <div>
        <input
          style={{
            color: `var(--${className})`,
          }}
          value={term}
          className={className}
          ref={forwardedRef}
          autoFocus
          onChange={(e) => {
            dispatch(setTerm(e.target.value.trimStart()));
          }}
        />
        <CurrentCommandContext.Provider value={currentCommand}>
          <Autocomplete style={{ color: `var(--${className})` }} />
        </CurrentCommandContext.Provider>
      </div>
      <span
        style={{
          color: `var(--${className})`,
        }}
        className={`terminal-output ${className} ${icons || "fontawe"}`}
      ></span>
    </div>
  );
});

export default Terminal;
