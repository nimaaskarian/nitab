import { shallowEqual, useSelector } from "react-redux";
import history from "services/history";

const usePushHistory = () => {

  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const identifier = useSelector(({ data }) => data.terminal.identifier);

  return function() {
    window.document.title = `${term} - ${identifier}Niotab`;
    history.push({ search: "?t=" + term });
  }
}

export default usePushHistory;
