import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const useIsTermEmpty = () => {
  const isTerminalSelector = createSelector(
    ({ ui }) => ui.term,
    (term) => !term
  );
  const isTermEmpty = useSelector(isTerminalSelector);
  return isTermEmpty;
};

export default useIsTermEmpty;
