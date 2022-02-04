/*global chrome*/
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import history from "../js/history";
import Autocomplete from "./Autocomplete";
import { termToCommand } from "../js/commands.js";
import { setTerm, setAc } from "../actions";

import "../css/Terminal.css";
import "../css/commandsColors.css";

const Terminal = React.forwardRef((props, ref) => {
  const [onSubmit, setOnSubmit] = useState(() => {});
  const termClass = () => {
    const { name } = termToCommand(props.term, props.identifier, props.commands);
    return ["taskbar", "command"].includes(name)
      ? {}
      : { icons: props.commandIcons[name], className: name };
  };

  useEffect(() => {
    const acHandler = ({ ac }) => {
      props.setAc(ac);
    };
    document.addEventListener("autocomplete", acHandler, false);
    return () => {
      document.removeEventListener("autocomplete", acHandler);
    };
  }, []);
  useEffect(() => {
    const command = termToCommand(props.term, props.identifier, props.commands);
    let input;
    if (command.name && command.name !== "search") {
      if (props.commands[command.name](command.args))
        if (typeof props.commands[command.name](command.args)() === "string")
          input = props.commands[command.name](command.args)();
    }
    if (!input) input = props.term;
    const url =
      "https://duckduckgo.com/ac/?callback=autocompleteCallback&q=" + input;
    const script = document.createElement("script");
    try {
      script.src = url;
    } catch (error) {}
    let timeoutId, appended;

    if (props.term) {
      props.setAc([]);
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 100);
    } else {
      props.setAc([]);
    }
    return () => {
      if (props.term) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [props.term]);

  useEffect(() => {
    const onSubmitHelper = (e) => {
      const { args } = termToCommand(props.term, props.identifier, props.commands);
      if (e.code === "Enter" && onSubmit.f) {
        let _output = onSubmit.f(args);
        if (typeof _output === "string") {
          const prevTitle = document.title;
          window.document.title = props.term + " - " + prevTitle;
          history.push({ search: "?t=" + props.term });
          if (e.altKey !== props.altNewtab) document.location = _output;
          else {
            window.open(_output);
          }
        } else {
          _output({
            altKey: e.altKey !== props.altNewtab,
          });
        }
      }
    };
    window.addEventListener("keydown", onSubmitHelper);
    return () => {
      window.removeEventListener("keydown", onSubmitHelper);
    };
  }, [onSubmit]);
  useEffect(() => {
    const { name, args } = termToCommand(
      props.term,
      props.identifier,
      props.commands
    );
    if (name) {
      setOnSubmit({
        f: props.commands[name](args),
      });
    } else setOnSubmit(() => {});
  }, [props.term, props.commands, props.altNewtab]);
  const { className, icons } = termClass();
  return (
    <div
      style={{
        direction: `${/^[\u0600-\u06FF\s]+/.test(props.term) ? "rtl" : "ltr"}`,
      }}
      className="terminal foreground-change"
    >
      <div>
        <input
          style={{
            color: `var(--${className})`,
          }}
          value={props.term}
          className={className}
          ref={ref}
          autoFocus
          onChange={(e) => {
            props.setTerm(e.target.value.trimStart());
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
const mapStateToProp = (state) => {
  return {
    identifier: state.data.identifier,
    altNewtab: state.data.altNewtab,
    term: state.ui.term,
    ac: state.ui.ac,
  };
};
export default connect(mapStateToProp, { setTerm, setAc }, null, {
  forwardRef: true,
})(Terminal);
