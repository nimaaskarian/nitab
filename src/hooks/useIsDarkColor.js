import { useMemo } from "react";
import isDark from "services/isdark.min";

const useIsDarkColor = (color, dependencyList = [color]) => {
  const memoized = useMemo(() => isDark(color), dependencyList);
  return memoized;
};

export default useIsDarkColor;
