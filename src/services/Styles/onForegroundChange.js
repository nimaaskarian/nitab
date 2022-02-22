import isDark from "services/Styles/isdark-min";

const onForegroundChange = (stylesheet, color) => {
  stylesheet.insertRule(
    `.foreground-change *,.foreground-change{color:${color};}`,
    stylesheet.rules.length
  );
  stylesheet.insertRule(
    `.foreground-change *::selection,.foreground-change::selection{background-color:${color};color:${
      isDark(color) ? "#CCC" : "#333"
    };}`,
    stylesheet.rules.length
  );
};

export default onForegroundChange;
