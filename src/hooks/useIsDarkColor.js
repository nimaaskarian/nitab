import { useMemo } from "react";
import isDark from "services/isdark.min";

const useIsDarkColor = (color) => {
  const memoized = useMemo(() => isDark(color), [color]);
  return memoized;
};

export default useIsDarkColor;
