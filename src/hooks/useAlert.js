/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { completeTodo, removeTodo } from "store/actions";
import useDidMountEffect from "./useDidMountEffect";
import AlertComponent from "components/Alert";
const Alert = (props) => {
  const alert = useAlert();
  const [prevCommands, setPrevCommands] = useState(null);
  const todos = useSelector(({ data }) => data.todos);
  const dipatch = useDispatch();
  const currentCommands = useSelector(({ data }) => data.commands);
  const altNewtab = useSelector(({ data }) => data.altNewtab);
  const acCommands = useSelector(({ data }) => data.acCommands);
  const isAcCommands = useSelector(({ data }) => data.isAcCommands);
  const backgroundsLength = useSelector(({ data }) => data.backgrounds.length);
  useDidMountEffect(() => {
    alert.show(
      <AlertComponent>
        {altNewtab
          ? "Default enter behaviour is now current tab"
          : "Default enter behaviour is now new tab"}
      </AlertComponent>
    );
  }, [altNewtab]);
  useDidMountEffect(() => {
    alert.show(
      <AlertComponent>
        You have {backgroundsLength} backgrounds now
      </AlertComponent>
    );
  }, [backgroundsLength]);
  useDidMountEffect(() => {
    alert.show(
      <AlertComponent>
        Autocomplete now suggests{" "}
        {`${acCommands ? acCommands : "no"} command${
          acCommands === 1 ? "" : "s"
        }`}
      </AlertComponent>
    );
  }, [acCommands]);
  useDidMountEffect(() => {
    alert.show(
      <AlertComponent>
        {`You turned ${
          isAcCommands ? "on" : "off"
        } autocomplete command suggestions`}
      </AlertComponent>
    );
  }, [isAcCommands]);
  useEffect(() => {
    alert.removeAll();
    if (!props.isTerminal)
      todos.forEach((todo, index) => {
        alert.show(
          <AlertComponent
            style={{
              direction: `${
                /^[\u0600-\u06FF\s]+/.test(todo.message) ? "rtl" : "ltr"
              }`,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>{todo.message}</div>
            <a
              style={{ marginLeft: "5px", cursor: "pointer" }}
              className="far fa-circle"
              onClick={(e) => {
                e.target.className = "far fa-check-circle";
                setTimeout(() => {
                  dipatch(completeTodo(index));
                }, 350);
              }}
            />
            <a
              style={{ marginLeft: "5px", cursor: "pointer", color: "red" }}
              className="far fa-trash"
              onClick={(e) => {
                setTimeout(() => {
                  dipatch(removeTodo(index));
                }, 350);
              }}
            />
          </AlertComponent>,
          { timeout: 0 }
        );
      });
  }, [todos, props.isTerminal]);

  useEffect(() => {
    if (!prevCommands) setPrevCommands({ ...currentCommands });
    return () => {
      if (typeof currentCommands === "object")
        setPrevCommands({ ...currentCommands });
    };
  }, [currentCommands]);
  useEffect(() => {
    if (prevCommands) {
      let updates = [];
      Object.keys(prevCommands).forEach((key) => {
        if (!currentCommands.hasOwnProperty(key))
          updates.push({ key, type: "delete" });
      });
      Object.keys(currentCommands).forEach((key) => {
        if (!prevCommands.hasOwnProperty(key))
          updates.push({ key, type: "add" });
      });
      updates.forEach((e) => {
        alert.show(
          <AlertComponent>
            {e.type === "add"
              ? `You've added "${e.key}" to your commands`
              : `You've deleted "${e.key}" from your commands`}
          </AlertComponent>
        );
      });
    }
  }, [prevCommands]);
};

export default Alert;
