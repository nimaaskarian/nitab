import { useEffect, useState } from "react";

const useIsThemeDark = () => {
  const getCurrentTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useState(getCurrentTheme());

  const mediaQueryListener = (e) => {
    setIsDark(e.matches);
  };

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    darkThemeMediaQuery.addEventListener("change", mediaQueryListener);
    return () => {
      darkThemeMediaQuery.removeEventListener("change", mediaQueryListener);
    };
  }, []);

  return isDark;
};

export default useIsThemeDark;
