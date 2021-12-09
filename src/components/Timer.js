import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setTimerEditFocus } from "../actions";

import Countdown from "./Countdown";
import TimerEdit from "./TimerEdit";
const Timer = (props) => {
  return (
    <div
      style={{
        position: props.clockPos !== "center" ? "absolute" : null,
        top: props.clockPos !== "center" ? "20px" : null,
        [props.clockPos]: "5vw",
        alignItems: props.clockAlign,
        transform: props.clockPos !== "center" ? "translateY(0)" : null,
      }}
      className="clock foreground-change"
    >
      <div
        className="clock-time"
        onClick={() => {
          props.setTimerEditFocus(true);
        }}
      >
        {props.timerEditFocus ? <TimerEdit /> : <Countdown />}
      </div>
    </div>
  );
};
const mapStateToProps = (state, ownProps) => {
  return {
    clockPos: state.data.clockPos,
    clockAlign: state.data.clockAlign,
    timerEditFocus: state.ui.timerEditFocus,
  };
};
export default connect(mapStateToProps, { setTimerEditFocus })(Timer);
