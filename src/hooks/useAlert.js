/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useSelector } from "react-redux";
import useDidMountEffect from "./useDidMountEffect";
import AlertComponent from "components/Alert";
import Todo from "components/Todo";
import UnsplashLoading from "components/UnsplashLoading";
const Alert = (props) => {
  const alert = useAlert();
  const [prevCommands, setPrevCommands] = useState(null);

  const isFetchingImage = useSelector(({ ui }) => ui.isFetchingImage);

  const todos = useSelector(({ data }) => data.todos);
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

  useEffect(() => {
    console.log("isfetchingimagechange", isFetchingImage);
    if (isFetchingImage) {
      let alertInstance = alert.show(
        <AlertComponent>
          <UnsplashLoading
            onLoaded={() => {
              alert.remove(alertInstance);
            }}
          />
        </AlertComponent>,
        {
          timeout: 0,
        }
      );
      return () => {
        alert.remove(alertInstance);
      };
    }
  }, [isFetchingImage]);

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
      todos
        .sort(function (a, b) {
          if (a.completed) {
            if (b.completed) return 0;
            return 1;
          }
          return -1;
        })
        .forEach((todo, index) => {
          alert.show(
            <AlertComponent>
              <Todo todo={todo} index={index} />
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
