/*global chrome*/
import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import "./css/AddTaskbar.css";
import isUrl from "../js/isUrl";

export default ({
  onSubmit,
  style,
  setIsTaskbar,
  taskbarIcons,
  selectedIndex,
  onIndexChange,
}) => {
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#fff");
  const [url, setUrl] = useState("");
  const [index, setIndex] = useState("-1");
  const indexToOutput = (index, taskbarIcons) => {
    index = parseInt(index);
    const nonEmpty = taskbarIcons.filter((e) => e.icon !== "empty");
    if (nonEmpty[index]) {
      parseInt(nonEmpty[index].index);
      return parseInt(nonEmpty[index].index);
    } else return -1;
  };
  useEffect(() => {
    let index = 0;
    for (let icon of taskbarIcons) {
      icon.index = index;
      index++;
    }
  }, [taskbarIcons]);
  useEffect(() => {
    const i = ![null, undefined].includes(selectedIndex)
      ? selectedIndex
      : indexToOutput(parseInt(index), taskbarIcons);
    let _index = 0;
    if (![null, undefined].includes(selectedIndex)) {
      setIndex(
        taskbarIcons
          .filter((e) => e.icon !== "empty")
          .map((e) => {
            if (e.index === i) return _index;
            _index++;
          })
          .filter((e) => e !== undefined)[0]
      );
    }

    console.log(i, selectedIndex);

    if (!taskbarIcons[i]) return;
    const { icon, url, color } = taskbarIcons[i];

    setIcon(icon);
    setUrl(url);
    setColor(color);
  }, [index, selectedIndex]);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setIsTaskbar(false);
  });
  return (
    <div className="add-taskbar" style={style}>
      <i className="fa fa-times close" onClick={() => setIsTaskbar(false)} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!icon || !url) return;
          onSubmit({
            icon,
            color,
            url,
            index: ![null, undefined].includes(selectedIndex)
              ? selectedIndex
              : indexToOutput(index, taskbarIcons),
          });
        }}
      >
        <div className="space-between">
          <div className="field">
            <label className="label" htmlFor="#add-taskbar-input">
              Icon(find some from{" "}
              <a
                href="https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=brands,solid,light"
                target="_blank"
              >
                here
              </a>
              ):
            </label>
            <div className="space-between">
              <input
                id="add-taskbar-input"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="fa fa-something"
              />
              <i className={"icon " + icon} style={{ color }}></i>
            </div>
          </div>
          <div className="field" style={{ width: "40%" }}>
            <label className="label" htmlFor="add-taskbar-index">
              Insert index:
            </label>
            <input
              id="add-taskbar-index"
              type="number"
              placeholder="-1 = last, 0 = first"
              value={index}
              onChange={(e) => {
                onIndexChange();
                setIndex(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">
            Color(you can find some brand colors from{" "}
            <a target="_blank" href="https://usbrandcolors.com/">
              here
            </a>
            ):
          </label>

          <SketchPicker
            color={color}
            onChange={(color) => {
              setColor(color.hex);
            }}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="#add-taskbar-url">
            URL:
          </label>

          <input
            style={{ color: isUrl(url) ? "#36b0c3" : "white" }}
            id="add-taskbar-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="somehost.com"
          />
        </div>

        <div className="space-between">
          <input
            className="ui inverted basic green button"
            type="submit"
            value={
              indexToOutput(index, taskbarIcons) === -1 &&
              [null, undefined].includes(selectedIndex)
                ? "Add"
                : "Edit"
            }
          />
          <input
            className="ui inverted basic red button"
            type="button"
            value="Clear"
            onClick={() => {
              setIcon("");
              setUrl("");
              setColor("#fff");
            }}
          />

          <input
            className="ui inverted basic button"
            type="button"
            value={
              indexToOutput(index, taskbarIcons) === -1 &&
              [null, undefined].includes(selectedIndex)
                ? "Whitespace at end"
                : "Whitespace before"
            }
            onClick={() => {
              onSubmit({
                icon: "empty",
                color: "",
                url: "",
                index: ![null, undefined].includes(selectedIndex)
                  ? selectedIndex
                  : indexToOutput(index, taskbarIcons),
              });
            }}
          />
        </div>
      </form>
    </div>
  );
};
