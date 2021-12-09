import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import {
  setCountingTo,
  setTimerEditFocus,
  setTimerData,
  setCurrentTimer,
  setTimerFlags,
} from "../actions";
import "../css/TimerEdit.css";
const TimerEdit = (props) => {
  const [seconds, setSeconds] = useState(props.timerData.seconds);
  const [minutes, setMinutes] = useState(props.timerData.minutes);
  const [hours, setHours] = useState(props.timerData.hours);

  const hoursElement = useRef();
  const minutesElement = useRef();
  const secondsElement = useRef();

  const formElement = useRef();
  return (
    <form
      ref={formElement}
      className="timer-edit"
      onKeyDown={({ code }) => {
        if (code === "Escape") {
          props.setTimerEditFocus(false);
          formElement.current.blur();
        }
      }}
      onKeyPress={({ code }) => {
        if (code === "Enter") {
          props.setCurrentTimer(0);
          props.setCountingTo(+seconds + +minutes * 60 + +hours * 3600);
          props.setTimerData({ hours, minutes, seconds });
          props.setTimerEditFocus(false);
          formElement.current.blur();
        }
      }}
    >
      <input
        pattern="[0-9]*"
        ref={hoursElement}
        onChange={({ target }) => {
          if (!Object.is(Number(target.value), NaN))
            setHours(target.value.slice(0, 2) || "");
        }}
        onKeyDown={({ target, code }) => {
          if (code === "Backspace")
            if (target.value.length <= 0) minutesElement.current.focus();
          if (code === "Tab") hoursElement.current.focus();
        }}
        value={hours}
        placeholder="00"
      />
      :
      <input
        pattern="[0-9]*"
        ref={minutesElement}
        onChange={({ target }) => {
          if (!Object.is(Number(target.value), NaN))
            setMinutes(target.value.slice(0, 2) || "");
          if (target.value.length >= 2) hoursElement.current.focus();
        }}
        onKeyDown={({ target, code }) => {
          if (code === "Backspace")
            if (target.value.length <= 0) secondsElement.current.focus();
          if (code === "Tab") hoursElement.current.focus();
        }}
        value={minutes}
        placeholder="00"
      />
      :
      <input
        autoFocus
        pattern="[0-9]*"
        ref={secondsElement}
        onChange={({ target }) => {
          if (!Object.is(Number(target.value), NaN))
            setSeconds(target.value.slice(0, 2) || "");
          if (target.value.length >= 2) minutesElement.current.focus();
        }}
        onKeyDown={({ code }) => {
          if (code === "Tab") minutesElement.current.focus();
        }}
        value={seconds}
        placeholder="00"
      />
    </form>
  );
};
const mapStateToProps = (state) => {
  return {
    timerData: state.data.timerData,
  };
};
export default connect(mapStateToProps, {
  setCountingTo,
  setTimerEditFocus,
  setTimerData,
  setCurrentTimer,
  setTimerFlags,
})(TimerEdit);
