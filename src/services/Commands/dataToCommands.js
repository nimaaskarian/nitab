import defaultCommands from "./defaultCommands";
import { isDark } from "services/Styles";

const dataToCommands = (data) => {
  let commands = {},
    icons = {};
  Object.keys(data).forEach((command) => {
    if (data[command].icon) icons[command] = data[command].icon;
    if (data[command].color) {
      const _styleIndex = document.styleSheets.length - 1;
      const stylesheet = document.styleSheets[_styleIndex];
      stylesheet.insertRule(
        `.${command}::selection{background-color:${
          data[command].color
        } !important;
        color:${isDark(data[command].color) ? "#CCC" : "#333"} !important;}`,
        stylesheet.rules.length
      );
      document.documentElement.style.setProperty(
        `--${command}`,
        data[command].color
      );
    }

    commands[command] = (input) => {
      if (!data[command].args) return;
      if (data[command].args.length === 1)
        return () => {
          const [hasntInput, hasInput] = data[command].args[0]
            .replace("%input%", input)
            .split("%?%");
          if (hasInput) {
            if (input) return defaultCommands.url(hasInput)();
            return defaultCommands.url(hasntInput)();
          }
          return defaultCommands.url(hasntInput)();
        };
      else
        return () =>
          ({ input }) => {
            data[command].args.forEach((element) => {
              const [hasntInput, hasInput] = element
                .replace("%input%", input)
                .split("%?%");

              if (hasInput) {
                if (input) window.open(defaultCommands.url(hasInput)());
                else window.open(defaultCommands.url(hasntInput)());
              } else window.open(defaultCommands.url(hasntInput)());
            });
          };
    };
  });
  return { commands: { ...defaultCommands, ...commands }, icons };
};

export default dataToCommands;
