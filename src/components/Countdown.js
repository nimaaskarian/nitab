import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  setCurrentTimer,
  setCountingTo,
  setTimerIsPaused,
  addTimerFlags,
} from "store/actions";

const Countdown = (props) => {
  const [timeoutID, setTimeoutID] = useState(null);
  const formatTime = (s) => {
    if (s < 0) s = 0;
    return new Date(Math.round(s) * 1000).toISOString().substr(11, 8);
  };
  const onFinish = () => {
    
    props.setTimerIsPaused(true);
    props.setCurrentTimer(0);
    if (props.loop) {
      props.addTimerFlags();
      props.setTimerIsPaused(false);
    }
  };
  useEffect(() => {
    if (props.countingTo === props.currentTimer) clearTimeout(timeoutID);
    else {
      if (!props.isPaused)
        setTimeoutID(
          setTimeout(() => {
            props.setCurrentTimer(props.currentTimer + 1);
            
          }, 1000)
        );
      else {
        clearTimeout(timeoutID);
      }
    }

    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.currentTimer, props.isPaused]);
  useEffect(() => {
    if (props.countingTo - props.currentTimer === 0) onFinish();
  }, [props.countingTo, props.currentTimer]);
  return <div>{formatTime(props.countingTo - props.currentTimer)}</div>;
};
const mapStateToProps = (state) => {
  return {
    currentTimer: state.data.currentTimer,
    countingTo: state.data.countingTo,
    loop: state.data.timerLoop,
    isPaused: state.data.timerIsPaused,
    addTimerFlags: state.data.addTimerFlags,
    ...state.data.timerData,
  };
};
export default connect(mapStateToProps, {
  setCurrentTimer,
  setCountingTo,
  setTimerIsPaused,
  addTimerFlags,
})(Countdown);
