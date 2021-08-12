/*global chrome*/
import React, { useState, useEffect } from "react";
import { termToCommand } from "../js/commands";
import "localforage-observable/dist/localforage-observable.es6";
const Terminal = React.forwardRef(
  ({ onChange, altNewtab, setIsTaskbar, term, commands, identifier }, ref) => {
    const [onSubmit, setOnSubmit] = useState(() => {});
    const termClass = () => {
      const { name } = termToCommand(term, identifier, commands);
      return name === "taskbar" ? "" : name;
    };
    useEffect(() => {
      const onSubmitHelper = (e) => {
        const { name, args } = termToCommand(term, identifier, commands);
        if (e.code === "Enter") {
          if (name === "taskbar") setIsTaskbar(true);
          else {
            let _output = onSubmit.f({
              altKey: e.altKey !== altNewtab,
              input: args,
            });
            if (typeof _output === "string") {
              if (e.altKey !== altNewtab) document.location = _output;
              else window.open(_output);
            }
          }
        }
      };
      window.addEventListener("keydown", onSubmitHelper);
      return () => {
        window.removeEventListener("keydown", onSubmitHelper);
      };
    }, [onSubmit]);
    useEffect(() => {
      const { name, args } = termToCommand(term, identifier, commands);
      if (name) {
        setOnSubmit({
          f: commands[name](args),
        });
      } else setOnSubmit(() => {});
    }, [term, commands, altNewtab]);

    return (
      <div
        style={{
          direction: `${/^[\u0600-\u06FF\s]+/.test(term) ? "rtl" : "ltr"}`,
        }}
        className="terminal foreground-change"
      >
        <input
          ref={ref}
          autoFocus
          value={term}
          onChange={(e) => {
            onChange(e.target.value.trimStart());
          }}
          type="text"
          className={"terminal-input " + termClass()}
        />
        <span
          className={`terminal-output ${
            termToCommand(term, identifier, commands).name ? "fontawe" : ""
          } ${termClass()}`}
        ></span>
      </div>
    );
  }
);
export default Terminal;
