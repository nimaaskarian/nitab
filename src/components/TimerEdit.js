import React, { useRef } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { setCountingTo, setTimerEditFocus } from "../actions";
import "../css/TimerEdit.css";
const TimerEdit = (props) => {
  const [seconds, setSeconds] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [hours, setHours] = useState(null);

  const hoursElement = useRef();
  const minutesElement = useRef();
  const secondsElement = useRef();

  const formElement = useRef();
  return (
    <form
      ref={formElement}
      className="timer-edit"
      onKeyPress={({ code }) => {
        if (code === "Enter") {
          props.setCountingTo(
            Date.now() + seconds * 1000 + minutes * 60000 + hours * 3600000
          );
          props.setTimerEditFocus(false);
          formElement.current.blur();
        }
      }}
    >
      <input
        type="number"
        ref={hoursElement}
        onChange={({ target }) => {
          setHours(parseInt(target.value.slice(0, 2) || 0) || null);
        }}
        onKeyDown={({ target, code }) => {
          if (code === "Backspace")
            if (target.value.length <= 0) minutesElement.current.focus();
        }}
        value={hours}
        placeholder="00"
      />
      :
      <input
        type="number"
        ref={minutesElement}
        onChange={({ target }) => {
          setMinutes(parseInt(target.value.slice(0, 2) || 0) || null);
          if (target.value.length >= 2) hoursElement.current.focus();
        }}
        onKeyDown={({ target, code }) => {
          if (code === "Backspace")
            if (target.value.length <= 0) secondsElement.current.focus();
        }}
        value={minutes}
        placeholder="00"
      />
      :
      <input
        type="number"
        ref={secondsElement}
        onChange={({ target }) => {
          setSeconds(parseInt(target.value.slice(0, 2) || 0) || null);
          if (target.value.length >= 2) minutesElement.current.focus();
        }}
        value={seconds}
        placeholder="00"
      />
    </form>
  );
};

export default connect(null, { setCountingTo, setTimerEditFocus })(TimerEdit);
