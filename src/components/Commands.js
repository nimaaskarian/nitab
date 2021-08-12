/*global chrome*/
import React, { useEffect, useState } from "react";
import Command from "./Command";
import "./css/Commands.css";
import defaultCommands from "../js/commands";
import localforage from "localforage";
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
export default () => {
  const [commands, setCommands] = useState({});
  useEffect(() => {
    localforage.getItem("commands", (err, _commands) => {
      setCommands(_commands);
    });
    if (chrome.storage)
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let [key, { newValue }] of Object.entries(changes)) {
          if (key === "commands") {
            setCommands(newValue);
          }
        }
      });
  }, []);
  const renderedDefaults = () => {
    if (defaultCommands)
      return Object.keys(defaultCommands).map((e) => {
        return (
          <Command
            key={e}
            cmdName={e}
            cmd={defaultCommands[e]}
            notDelete={true}
          />
        );
      });
    else return null;
  };
  console.log(renderedDefaults);
  return (
    <React.Fragment>
      <div className="menu">
        <a className="fontawe angle-left" href="./index.html" />
      </div>

      <div className="commands">
        {Object.size(commands)
          ? Object.keys(commands).map((e) => {
              return <Command key={e} cmdName={e} cmd={commands[e]} />;
            })
          : null}
      </div>
      <div className="commands">{renderedDefaults()}</div>
    </React.Fragment>
  );
};
