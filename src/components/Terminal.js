/*global chrome*/
import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "react-autocomplete";
import { termToCommand } from "../js/commands";
import "localforage-observable/dist/localforage-observable.es6";
const Terminal = React.forwardRef(
  (
    { onChange, altNewtab, setIsTaskbar, term, commands, identifier, ac },
    ref
  ) => {
    const [onSubmit, setOnSubmit] = useState(() => {});

    const termClass = () => {
      const { name } = termToCommand(term, identifier, commands);
      return name === "taskbar" ? "" : name;
    };
    useEffect(() => {
      const onkeydown = (e) => {
        const selected = document.querySelector(".item.selected");
        if (e.code === "Tab") {
          if (selected) {
            onChange(selected.innerText);
          }
        }
      };
      window.addEventListener("keydown", onkeydown);
      return () => {
        window.removeEventListener("keydown", onkeydown);
      };
    }, [ac]);
    useEffect(() => {
      const onSubmitHelper = (e) => {
        const { name, args } = termToCommand(term, identifier, commands);
        if (e.code === "Enter" && onSubmit.f) {
          if (name === "taskbar") setIsTaskbar(true);
          else {
            let _output = onSubmit.f(args);

            if (typeof _output === "string") {
              if (e.altKey !== altNewtab) document.location = _output;
              else window.open(_output);
            } else {
              _output({
                altKey: e.altKey !== altNewtab,
              });
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
        className={"terminal foreground-change " + termClass()}
      >
        <Autocomplete
          menuStyle={{
            fontSize: "16px",
            backgroundColor: "rgba(0,0,0,0)",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
          }}
          getItemValue={(item) => item.phrase}
          items={ac}
          renderItem={(item, isHighlighted) => {
            return (
              <div
                key={item.phrase}
                className={`item ${
                  isHighlighted ? "selected" : "not-selected"
                }`}
                style={{ background: isHighlighted?`linear-gradient(
                  ${/^[\u0600-\u06FF\s]+/.test(term) ? "90" : "270"}deg,
                  rgba(0, 0, 0, 0) 50%,
                  rgba(0, 0, 0, 0.1) 100%
                )`:null}}
              >
                {item.phrase}
              </div>
            );
          }}
          autoFocus
          value={term}
          onChange={(e) => {
            onChange(e.target.value.trimStart());
          }}
          ref={ref}
          selectOnBlur={true}
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
