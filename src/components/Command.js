/*global chrome*/
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import localforage from "localforage";
export default ({ cmdName, cmd, notDelete }) => {
  const onDeleteButtonClick = () => {
    const _commands = localforage.getItem("commands");
    delete _commands[cmdName];
    localforage.setItem("commands", _commands);
  };

  return (
    <div className="command">
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div className="cmdName">/{cmdName}</div>
        <div className="cmd">
          {cmd.map ? (
            cmd.map((value) => {
              return (
                <div>
                  {parse(
                    value.replace(
                      "%input%",
                      `<span class="input">%input%</span>`
                    )
                  )}
                </div>
              );
            })
          ) : (
            <div>{"" + cmd}</div>
          )}
        </div>
      </div>
      {notDelete ? null : (
        <div>
          <button
            className="ui button inverted red"
            onClick={onDeleteButtonClick}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
