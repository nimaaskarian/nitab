import defaultCommands from "./defaultCommands";

const dataToCommands = (data) => {
  let commands = {};
  Object.keys(data).forEach((command) => {
    commands[command] = {};
    const { color, icon } = data[command];
    commands[command] = { color, icon };

    commands[command].function = (input) => {
      if (!data[command].args) return;
      if (data[command].args.length === 1)
        return () => {
          const [hasntInput, hasInput] = data[command].args[0]
            .replace("%input%", input)
            .split("%?%");
          if (hasInput) {
            if (input) return defaultCommands.url.function(hasInput)();
            return defaultCommands.url.function(hasntInput)();
          }
          return defaultCommands.url.function(hasntInput)();
        };
      else
        return () =>
          ({ input }) => {
            data[command].args.forEach((element) => {
              const [hasntInput, hasInput] = element
                .replace("%input%", input)
                .split("%?%");

              if (hasInput) {
                if (input) window.open(defaultCommands.url.function(hasInput)());
                else window.open(defaultCommands.url.function(hasntInput)());
              } else window.open(defaultCommands.url.function(hasntInput)());
            });
          };
    };
  });
  return { commands: { ...defaultCommands, ...commands } };
};

export default dataToCommands;
