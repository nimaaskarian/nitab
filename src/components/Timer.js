import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  setTimerEditFocus,
  setTimerFlags,
  toggleTimerIsPaused,
  toggleTimerLoop,
  toggleIsClock
} from "../actions";

import Countdown from "./Countdown";
import TimerEdit from "./TimerEdit";

import "../css/Timer.css";
const Timer = (props) => {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        props.toggleIsClock();
      }}
      style={{
        position: props.clockPos !== "center" ? "absolute" : null,
        top: props.clockPos !== "center" ? "20px" : null,
        [props.clockPos]: "5vw",
        alignItems: props.clockAlign,
        transform: props.clockPos !== "center" ? "translateY(0)" : null,
      }}
      className="clock foreground-change timer"
    >
      <div
        className="clock-time"
        onClick={() => {
          props.setTimerEditFocus(true);
        }}
      >
        {props.timerEditFocus ? <TimerEdit /> : <Countdown />}
      </div>
      <div className="clock-date">
        <a
          className={`fal fa-repeat ${props.timerLoop ? null : "disabled"}`}
          onClick={props.toggleTimerLoop}
        />
        <a
          className={`fal fa-${props.timerIsPaused ? "play" : "pause"}`}
          onClick={() => {
            props.setTimerFlags(0);
            props.toggleTimerIsPaused();
          }}
        />
      </div>
      {props.timerLoop ? (
        <div
          className="weather"
          style={{ cursor: "pointer" }}
          onDoubleClick={() => props.setTimerFlags(0)}
        >
          <a className="fa fa-flag-pennant" style={{ marginRight: "5px" }} />
          <span>{props.timerFlags}</span>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    clockPos: state.data.clockPos,
    clockAlign: state.data.clockAlign,
    timerEditFocus: state.ui.timerEditFocus,
    timerLoop: state.data.timerLoop,
    timerIsPaused: state.data.timerIsPaused,
    timerFlags: state.data.timerFlags,
  };
};
export default connect(mapStateToProps, {
  setTimerEditFocus,
  toggleTimerLoop,
  toggleTimerIsPaused,
  setTimerFlags,
  toggleIsClock
})(Timer);