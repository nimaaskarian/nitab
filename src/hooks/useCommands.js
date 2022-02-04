import { useMemo } from "react";
import { useSelector } from "react-redux";
import dataToCommands from "../utils/dataToCommands";
import defaultCommands from "../js/commands";
const useCommands = () => {
  const commands = useSelector(({ data }) => data.commands);
  const output = useMemo(() => {
    return { ...defaultCommands, ...dataToCommands(commands) };
  }, [commands]);
  return output;
};

export default useCommands;
