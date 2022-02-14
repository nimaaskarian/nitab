/*global chrome*/
import React, { useEffect, useMemo, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import history from "../js/history";
import Autocomplete from "./Autocomplete";
import { termToCommand } from "../js/commands.js";
import { setTerm, setAc } from "../actions";

import "../css/Terminal.css";
import "../css/commandsColors.css";

const Terminal = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const identifier = useSelector(({ data }) => data.identifier);
  const altNewtab = useSelector(({ data }) => data.altNewtab);
  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const acCommands = useSelector(({ data }) => data.acCommands, shallowEqual);
  const isAcCommands = useSelector(
    ({ data }) => data.isAcCommands,
    shallowEqual
  );
  const currentCommand = useMemo(() => {
    return termToCommand(term, identifier, props.commands);
  }, [term, identifier, props.commands]);

  const termClass = useCallback(() => {
    const { name } = currentCommand;
    return ["taskbar", "command"].includes(name)
      ? {}
      : { icons: props.commandIcons[name], className: name };
  }, [currentCommand, props.commandIcons]);

  useEffect(() => {
    const acHandler = ({ ac }) => {
      const iden = identifier === "NONE" ? "" : identifier;
      let commandsSuggestions = Object.keys(props.commands)
        .filter((e) => (iden + e).includes(term))
        .sort()
        .sort(function (a, b) {
          if (a.startsWith(term)) {
            if (b.startsWith(term)) return 0;
            return -1;
          }
          return 1;
        })
        .slice(0, acCommands)
        .map((phrase) => {
          return {
            phrase: iden + phrase,
            icon: props.commandIcons[phrase] || `fontawe ${phrase}`,
          };
        });
      if (!isAcCommands) commandsSuggestions = [];
      dispatch(
        setAc(
          [...commandsSuggestions, ...ac]
            .filter(({ phrase }) => phrase !== term)
            .slice(0, 8)
        )
      );
    };
    document.addEventListener("autocomplete", acHandler, false);
    return () => {
      document.removeEventListener("autocomplete", acHandler);
    };
  }, [term, props.commands, identifier, props.commandIcons, isAcCommands]);
  useEffect(() => {
    const command = currentCommand;
    let input;
    if (command.name && command.name !== "search") {
      if (props.commands[command.name](command.args))
        if (typeof props.commands[command.name](command.args)() === "string")
          input = props.commands[command.name](command.args)();
    }
    if (!input) input = term;
    const url =
      "https://duckduckgo.com/ac/?callback=autocompleteCallback&q=" + input;
    const script = document.createElement("script");
    try {
      script.src = url;
    } catch (error) {}
    let timeoutId, appended;

    dispatch(setAc([]));
    if (term) {
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 100);
    }
    return () => {
      if (term) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [term]);

  useEffect(() => {
    let onSubmit;
    try {
      onSubmit = props.commands[currentCommand.name](currentCommand.args);
    } catch (error) {}
    const onSubmitHelper = (e) => {
      const { args } = currentCommand;
      if (e.code === "Enter" && onSubmit) {
        let _output = onSubmit(args);
        if (typeof _output === "string") {
          const prevTitle = document.title;
          window.document.title = term + " - " + prevTitle;
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
          ref={ref}
          autoFocus
          onChange={(e) => {
            dispatch(setTerm(e.target.value.trimStart()));
          }}
        />
        <Autocomplete style={{ color: `var(--${className})` }} />
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
