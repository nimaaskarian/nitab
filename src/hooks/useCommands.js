import { useMemo } from "react";
import { useSelector } from "react-redux";
import { defaultCommands, dataToCommands } from "services/Commands";

const useCommands = () => {
  const commands = useSelector(({ data }) => data.commands);
  const output = useMemo(() => {
    return { ...defaultCommands, ...dataToCommands(commands) };
  }, [commands]);
  return output;
};

export default useCommands;
