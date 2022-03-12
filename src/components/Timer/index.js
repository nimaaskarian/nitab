import React from "react";
import { connect } from "react-redux";
import {
  setTimerEditFocus,
  setTimerFlags,
  toggleTimerIsPaused,
  toggleTimerLoop,
  toggleIsClock,
  addTimerFlags,
  setCurrentTimer,
  setTimerIsPaused,
} from "store/actions";

import Countdown from "../Countdown";
import TimerEdit from "../TimerEdit";

import "./style.css";
const Timer = (props) => {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        props.toggleIsClock();
      }}
      className="clock foreground-change timer"
      style={{
        position: props.clockPos !== "center" ? "absolute" : null,
        top: props.clockPos !== "center" ? "20px" : null,
        [props.clockPos]: "5vw",
        transform: props.clockPos !== "center" ? "translateY(50%)" : null,
      }}
    >
      <div
        className="clock-wrapper"
        style={{
          alignItems: props.clockAlign,
        }}
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
            className={`far fa-repeat ${props.timerLoop ? null : "disabled"}`}
            onClick={props.toggleTimerLoop}
          />
          <a
            className={`fal fa-${props.timerIsPaused ? "play" : "pause"}`}
            onClick={() => {
              props.toggleTimerIsPaused();
            }}
          />
          {props.timerLoop ? (
            <a
              className="fal fa-forward-step"
              onClick={() => {
                props.addTimerFlags(1);
                props.setCurrentTimer(0);

                props.toggleTimerIsPaused();
                setTimeout(() => {
                  props.toggleTimerIsPaused();
                }, 1);
              }}
            />
          ) : null}
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
  toggleIsClock,
  addTimerFlags,
  setCurrentTimer,
  setTimerIsPaused,
})(Timer);
