/*global chrome*/
import React, { useState, useEffect } from "react";
import "localforage-observable/dist/localforage-observable.es6";
import { connect } from "react-redux";

import Autocomplete from "./Autocomplete";
import defaultCommands, { termToCommand } from "../js/commands";
import { setTerm, setAc } from "../actions";
import "../css/Terminal.css";
import "../css/commandsColors.css";

const Terminal = React.forwardRef((props, ref) => {
  const [onSubmit, setOnSubmit] = useState(() => {});

  const termClass = () => {
    const { name } = termToCommand(
      props.term,
      props.identifier,
      props.commands
    );
    return name === "taskbar" ? "" : name;
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
    script.src = url;
    let timeoutId, appended;

    if (props.term) {
      props.setAc([]);
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 250);
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
      const { args } = termToCommand(
        props.term,
        props.identifier,
        props.commands
      );
      if (e.code === "Enter" && onSubmit.f) {
        let _output = onSubmit.f(args);

        if (typeof _output === "string") {
          if (e.altKey !== props.altNewtab) document.location = _output;
          else window.open(_output);
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
            color: `var(--${termClass()})`,
          }}
          value={props.term}
          className={termClass()}
          ref={ref}
          autoFocus
          onChange={(e) => {
            props.setTerm(e.target.value.trimStart());
          }}
        />
        <Autocomplete style={{ color: `var(--${termClass()})` }} />
      </div>
      <span
        style={{
          color: `var(--${termClass()})`,
        }}
        className={`terminal-output ${
          termToCommand(props.term, props.identifier, props.commands).name
            ? "fontawe"
            : ""
        } ${termClass()}`}
      ></span>
    </div>
  );
});
const mapStateToProp = (state) => {
  const dataToCommand = (data) => {
    let temp = {};
    Object.keys(data).forEach((command) => {
      temp[command] = (input) => {
        if (!data[command]) return;
        if (data[command].length === 1)
          return () => {
            const [hasntInput, hasInput] = data[command][0]
              .replace("%input%", input)
              .split("%?%");
            if (hasInput) {
              if (input) return defaultCommands.url(hasInput)();
              return defaultCommands.url(hasntInput)();
            }
            return defaultCommands.url(hasntInput)();
          };
        else
          return () =>
            ({ input }) => {
              data[command].forEach((element) => {
                const [hasntInput, hasInput] = element
                  .replace("%input%", input)
                  .split("%?%");

                if (hasInput) {
                  if (input) window.open(defaultCommands.url(hasInput)());
                  else window.open(defaultCommands.url(hasntInput)());
                } else window.open(defaultCommands.url(hasntInput)());
              });
            };
      };
    });
    return temp;
  };
  return {
    commands: { ...defaultCommands, ...dataToCommand(state.data.commands) },
    identifier: state.data.identifier,
    altNewtab: state.data.altNewtab,
    term: state.ui.term,
    ac: state.ui.ac,
  };
};
export default connect(mapStateToProp, { setTerm, setAc }, null, {
  forwardRef: true,
})(Terminal);
