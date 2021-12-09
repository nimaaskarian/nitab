import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setCurrentTimer } from "../actions";
const Countdown = ({ countingTo, currentTimer, setCurrentTimer }) => {
  const [intervalid, setIntervalid] = useState(null);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    return new Date(Math.round(ms / 1000) * 1000).toISOString().substr(11, 8);
  };
  const onFinish = (intervalid) => {
    clearInterval(intervalid);
  };

  useEffect(() => {
    setIntervalid(
      setInterval(() => {
        setCurrentTimer(Date.now());
      }, 1000)
    );

    return () => {
      clearInterval(intervalid);
    };
  }, []);

  useEffect(() => {
    if (countingTo - currentTimer <= 0) onFinish(intervalid);
  }, [countingTo, currentTimer, intervalid]);
  return <div>{formatTime(countingTo - currentTimer)}</div>;
};
const mapStateToProps = (state) => {
  return {
    currentTimer: state.data.currentTimer,
    countingTo: state.data.countingTo,
  };
};
export default connect(mapStateToProps, { setCurrentTimer })(Countdown);
