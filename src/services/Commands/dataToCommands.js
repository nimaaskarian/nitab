import defaultCommands from "./defaultCommands";

function mapTermToInnerCommands(commandArray, commands) {
  return commandArray.map((item) => {
    if (!item) return;
    const usedCommands = /%.+=?.*%/.exec(item) || [];
    if (usedCommands.length) {
      usedCommands.forEach((command) => {
        const [commandName, commandArg] = command.replace(/%/g, "").split("=");

        const func = (
          commands[commandName] ||
          defaultCommands[commandName] ||
          {}
        ).function;
        if (func && typeof func(commandArg)() === "string")
          item = item.replace(command, func(commandArg || "")());
      });
    }
    return item;
  });
}
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
          let [hasntInput, hasInput] = data[command].args[0]
            .replace("%input%", input)
            .split("%?%");
          [hasntInput, hasInput] = mapTermToInnerCommands(
            [hasntInput, hasInput],
            commands
          );

          if (hasInput) {
            if (input) return defaultCommands.url.function(hasInput)();
            return defaultCommands.url.function(hasntInput)();
          }
          return defaultCommands.url.function(hasntInput)();
        };
      else
        return () => () => {
          data[command].args.forEach((element) => {
            let [hasntInput, hasInput] = element
              .replace("%input%", input)
              .split("%?%");
            [hasntInput, hasInput] = mapTermToInnerCommands(
              [hasntInput, hasInput],
              commands
            );
            if (hasInput) {
              if (input) window.open(defaultCommands.url.function(hasInput)());
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
        return [key, { ...value, ...commandsCopy }];
      }
      return [key, value];
    })
  );
  const commandsWithoutDefaults = Object.fromEntries(
    Object.entries(commands).filter(([key]) => !defaultCommands[key])
  );
  return { ...defaultCommandsCustomized, ...commandsWithoutDefaults };
};

export default dataToCommands;
