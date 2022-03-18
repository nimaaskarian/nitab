import { useContext, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CommandsContext from "context/CommandsContext";
import CurrentCommandContext from "context/CurrentCommandContext";
import { nanoid } from "nanoid";

const AutocompleteLogic = () => {
  const currentCommand = useContext(CurrentCommandContext);
  const commands = useContext(CommandsContext);
  const term = useSelector(({ ui }) => ui.term, shallowEqual);

  const suggestCommandsCount = useSelector(
    ({ data }) => data.terminal.suggestCommandsCount,
    shallowEqual
  );
  const suggestCommandsEnabled = useSelector(
    ({ data }) => data.terminal.suggestCommandsEnabled,
    shallowEqual
  );

  const [duckDuckAc, setDuckDuckAc] = useState([]);

  const identifier = useSelector(({ data }) => data.terminal.identifier);

  useEffect(() => {
    const acHandler = ({ ac }) => {
      setDuckDuckAc(
        ac.map((e) => {
          return { ...e, key: nanoid(10) };
        })
      );
    };
    document.addEventListener("autocomplete", acHandler, false);
    return () => {
      document.removeEventListener("autocomplete", acHandler);
    };
  }, [term, identifier]);

  const commandSuggestions = useMemo(() => {
    if (!suggestCommandsEnabled || !term) return [];
    return Object.keys(commands)
      .filter((e) => (identifier + e).includes(term.trim()))
      .sort()
      .sort(function (a, b) {
        if (a.startsWith(term)) {
          if (b.startsWith(term)) return 0;
          return -1;
        }
        return 1;
      })
      .slice(0, suggestCommandsCount)
      .map((phrase) => {
        return {
          key: nanoid(10),
          phrase: identifier + phrase + " ",
          icon: commands[phrase].icon || "fa fa-terminal",
        };
      });
  }, [
    suggestCommandsCount,
    commands,
    identifier,
    suggestCommandsEnabled,
    term,
  ]);

  useEffect(() => {
    const command = currentCommand;
    let input;
    if (command.name && command.name !== "search") {
      if (commands[command.name].function(command.args))
        if (typeof commands[command.name].function(command.args)() === "string")
          input = commands[command.name].function(command.args)();
    }
    if (!input) input = term;
    const url =
      "https://duckduckgo.com/ac/?callback=autocompleteCallback&q=" + input;
    const script = document.createElement("script");
    try {
      script.src = url;
    } catch (error) {}
    let timeoutId, appended;

    setDuckDuckAc([]);
    if (term) {
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 200);
    }
    return () => {
      if (term) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [term, suggestCommandsEnabled]);

  return useMemo(
    () =>
      [...commandSuggestions, ...duckDuckAc]
        .filter((e) => !term.includes(e.phrase))
        .slice(0, 8),
    [duckDuckAc, commandSuggestions]
  );
};

export default AutocompleteLogic;
