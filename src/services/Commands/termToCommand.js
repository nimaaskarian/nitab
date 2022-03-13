import isUrl from "./isUrl";

const termToCommand = (string, identifier, commands) => {
  let name, args;
  const { main, replace } = _regex(identifier);

  if (main.test(string)) {
    let values = string.replace(replace, "").split(" ");
    name = values[0];
    args = "";

    values.shift();
    for (let value of values) {
      args += args ? " " + value : "" + value;
    }
    if (!commands[name]) {
      [name, args] = _noCommand(string);
    }
  } else if (string) {
    [name, args] = _noCommand(string);
  }

  return { name, args };
};
export default termToCommand;

function _regex(identifier) {
  switch (identifier) {
    case "":
      return { main: new RegExp(".*"), replace: "" };
    case ".":
      identifier = `\.`;
    default:
      break;
  }
  const main = new RegExp(`^(?=${identifier}).*`, "g");
  const replace = new RegExp("^" + identifier, "g");

  return { main, replace };
}
function _noCommand(string) {
  let name, args;
  if (isUrl(string)) {
    name = "url";
    args = string;
  } else {
    if (/^chrome:\/\//.test(string)) {
      name = "c";
      args = string.replace(/^chrome:\/\//, "");
    } else {
      name = "search";
      args = string;
    }
  }
  return [name, args];
}
