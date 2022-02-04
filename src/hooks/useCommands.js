import { useMemo } from "react";
import { useSelector } from "react-redux";
import dataToCommands from "../utils/dataToCommands";

const useCommands = () => {
  const commands = useSelector(({ data }) => data.commands);
  const output = useMemo(() => {
    return dataToCommands(commands);
  }, [commands]);
  return output;
};

export default useCommands;
