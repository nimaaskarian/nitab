/*global chrome*/
import React, { useState, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import "localforage-observable/dist/localforage-observable.es6";
import { connect } from "react-redux";

import defaultCommands, { termToCommand } from "../js/commands";
import { setTerm, setAc } from "../actions";

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
    console.log(props.identifier);
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
    const onkeydown = (e) => {
      const selected = document.querySelector(".item.selected");
      if (e.code === "Tab") {
        if (selected) {
          props.setTerm(selected.innerText);
        } else {
          props.setTerm(props.ac[0].phrase);
        }
      }
    };
    window.addEventListener("keydown", onkeydown);
    return () => {
      window.removeEventListener("keydown", onkeydown);
    };
  }, [props.ac]);
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
        items={props.ac || []}
        renderItem={(item, isHighlighted) => {
          return (
            <div
              key={item.phrase}
              className={`item ${isHighlighted ? "selected" : "not-selected"}`}
              style={{
                background: isHighlighted
                  ? `linear-gradient(
                  ${/^[\u0600-\u06FF\s]+/.test(props.term) ? "90" : "270"}deg,
                  rgba(0, 0, 0, 0) 50%,
                  rgba(0, 0, 0, 0.1) 100%
                )`
                  : null,
              }}
            >
              {item.phrase}
            </div>
          );
        }}
        autoFocus
        value={props.term}
        onChange={(e) => {
          props.setTerm(e.target.value.trimStart());
        }}
        ref={ref}
        selectOnBlur={true}
      />
      <span
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
        if(!data[command]) return  
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
