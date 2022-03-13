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
                if (input)
                  window.open(defaultCommands.url.function(hasInput)());
                else window.open(defaultCommands.url.function(hasntInput)());
              } else window.open(defaultCommands.url.function(hasntInput)());
            });
          };
    };
  });
  const defaultCommandsCustomized = Object.fromEntries(
    Object.entries(defaultCommands).map(([key, value]) => {
      if (commands[key]) {
        const commandsCopy = Object.fromEntries(
          Object.entries(commands[key]).filter(
            ([key, value]) => !!value && key !== "function"
          )
        );
        console.log(commandsCopy);
        return [key, { ...value, ...commandsCopy }];
      }
      return [key, value];
    })
  );
  const commandsWithoutDefaults = Object.fromEntries(
    Object.entries(commands).filter(([key]) => !defaultCommands[key])
  );
  console.log(commandsWithoutDefaults);
  return {
    commands: { ...defaultCommandsCustomized, ...commandsWithoutDefaults },
  };
};

export default dataToCommands;
