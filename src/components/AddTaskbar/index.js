import React, { useState, useEffect, useMemo } from "react";
import { SketchPicker } from "react-color";
import { isUrl } from "services/Commands";
import { connect, useSelector } from "react-redux";

import "./style.css";

import {
  toggleTaskbarEdit,
  addTaskbarIcon,
  editEmptyTaskbarIcon,
  editTaskbarIcon,
  setAddTaskbarIndex,
} from "store/actions";
import ToggleSwitch from "../ToggleSwitch";
const AddTaskbar = (props) => {
  const addtaskbarIndex = useSelector(({ ui }) => ui.addtaskbarIndex);
  const [isEditToggle, setIsEditToggle] = useState(false);
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#fff");
  const [url, setUrl] = useState("");
  const [index, setIndex] = useState("-1");
  const indexToOutput = (index, taskbarIcons) => {
    index = parseInt(index);
    const nonEmpty = taskbarIcons.filter((e) => e.icon !== "empty");
    if (nonEmpty[index]) {
      return parseInt(nonEmpty[index].index);
    } else return -1;
  };
  const isAdd = useMemo(() => {
    return (
      isEditToggle ||
      (indexToOutput(index, props.taskbarIcons) === -1 &&
        [null, undefined].includes(addtaskbarIndex))
    );
  }, [addtaskbarIndex, index, props.taskbarIcons, isEditToggle]);

  const onSubmit = ({ icon, url, color, index }) => {
    const realIndex = index === -1 ? props.taskbarIcons.length : index + 1;
    if (isAdd) props.addTaskbarIcon({ icon, url, color, index: realIndex });
    else {
      if (icon === "empty")
        props.editEmptyTaskbarIcon({ icon, url, color, index });
      else props.editTaskbarIcon({ icon, url, color, index });
    }
  };
  useEffect(() => {
    let index = 0;
    for (let icon of props.taskbarIcons) {
      icon.index = index;
      index++;
    }
  }, [props.taskbarIcons]);
  useEffect(() => {
    const i = ![null, undefined].includes(addtaskbarIndex)
      ? addtaskbarIndex
      : indexToOutput(parseInt(index), props.taskbarIcons);
    let _index = 0;
    if (![null, undefined].includes(addtaskbarIndex)) {
      setIndex(
        props.taskbarIcons
          .filter((e) => e.icon !== "empty")
          .map((e) => {
            if (e.index === i) return _index;
            _index++;
          })
          .filter((e) => e !== undefined)[0]
      );
    }
    if (!props.taskbarIcons[i]) return;
    const { icon, url, color } = props.taskbarIcons[i];

    setIcon(icon);
    setUrl(url);
    setColor(color);
  }, [index, addtaskbarIndex]);

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") props.toggleTaskbarEdit();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return (
    <div className="add-taskbar" style={props.style}>
      <i className="fa fa-times close" onClick={props.toggleTaskbarEdit} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!icon || !url) return;
          onSubmit({
            icon,
            color,
            url,
            index: ![null, undefined].includes(addtaskbarIndex)
              ? addtaskbarIndex
              : indexToOutput(index, props.taskbarIcons),
          });
        }}
      >
        <div className="space-between">
          <div className="field">
            <label className="label" htmlFor="#add-taskbar-input">
              Icon(find some from{" "}
              <a href="https://fontawesome.com/v6.0/icons" target="_blank">
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
                props.setAddTaskbarIndex(null);
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
        <div className="space-between">
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
          <div className="field" style={{ width: "40%" }}>
            <label className="label" htmlFor="#add-taskbar-url">
              Force Add:
            </label>
            <ToggleSwitch onChange={setIsEditToggle} />
          </div>
        </div>

        <div className="space-between">
          <input
            className="ui inverted basic green button"
            type="submit"
            value={isAdd ? "Add" : "Edit"}
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
            value={isAdd ? "Whitespace at end" : "Whitespace before"}
            onClick={() => {
              onSubmit({
                icon: "empty",
                color: "",
                url: "",
                index: ![null, undefined].includes(addtaskbarIndex)
                  ? addtaskbarIndex
                  : indexToOutput(index, props.taskbarIcons),
              });
            }}
          />
        </div>
      </form>
    </div>
  );
};
const mapStateToProp = (state) => {
  return { taskbarIcons: state.data.taskbarIcons };
};
export default connect(mapStateToProp, {
  toggleTaskbarEdit,
  addTaskbarIcon,
  editTaskbarIcon,
  editEmptyTaskbarIcon,
  setAddTaskbarIndex,
})(AddTaskbar);