import defaultCommands from "./defaultCommands";

export function subStringOccurrence(str, subStr) {
  const indexOf = str.indexOf(subStr);
  let temp = str.slice(0, indexOf) + str.slice(indexOf + 1);
  let countOfSub = 1;
  let indexOfTemp = temp.indexOf(subStr);
  while (indexOfTemp !== -1) {
    temp = temp.slice(0, indexOfTemp) + temp.slice(indexOfTemp + 1);
    countOfSub++;
    indexOfTemp = temp.indexOf(subStr);
  }
  return countOfSub;
}

export function getPosition(str, subStr, i = 0) {
  const subOccurrence = subStringOccurrence(str, subStr);

  const indexOf = str.indexOf(subStr);
  if (!i) return indexOf;
  if (indexOf === -1) return -1;

  if (i >= subOccurrence) return -1;
  return str.split(subStr, i === "last" ? subOccurrence : i + 1).join(subStr)
    .length;
}

export function parseSurrounding(term, start, end = start, _results = [], _between = [], prevLastIndex = -1) {
  let firstIndex = getPosition(term, start);
  const output = { results: _results, rest: term, between: _between, closed: true }
  if (firstIndex === -1) return output;
  console.log(prevLastIndex)

  if (prevLastIndex !== -1) {
    _between.push(term.slice(prevLastIndex + 1, firstIndex));
    term = term.slice(0, prevLastIndex + 1) + term.slice(firstIndex);
    firstIndex -= firstIndex - (prevLastIndex + 1);
  }
  console.log(_between)

  const lastIndex = getPosition(term, end);

  if (lastIndex === -1)
    return { ...output, closed: false };

  _results.push(term.slice(firstIndex, lastIndex + 1));
  console.log(term);
  term = term.slice(0, firstIndex) + term.slice(lastIndex + 1);

  return parseSurrounding(term, start, end, _results, _between, lastIndex - _results[_results.length - 1].length);
}

function mapTermToInnerCommands(commandArray, commands) {
  return commandArray.map((item) => {
    if (!item) return;
    const usedCommand = (/\$\(.+=?.*\)/.exec(item) || [])[0];
    console.log(usedCommand);
    if (usedCommand) {
      const [commandName, commandArg] = usedCommand
        .replace(/\(|\)|\$/g, "")
        .split("=");

      const func = (commands[commandName] || defaultCommands[commandName] || {})
        .function;
      if (func && typeof func(commandArg)() === "string")
        item = item.replace(usedCommand, func(commandArg || "")());
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
