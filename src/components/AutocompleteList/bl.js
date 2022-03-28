import { useContext, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CommandsContext from "context/CommandsContext";
import CurrentCommandContext from "context/CurrentCommandContext";
import { nanoid } from "nanoid";

const AutocompleteLogic = () => {
  const currentCommand = useContext(CurrentCommandContext);
  const commands = useContext(CommandsContext);
  const defaultIcon = useSelector(({ data }) => data.terminal.defaultIcon);
  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const [duckduckDisabled, setDuckDuckDisabled] = useState(false);

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
          if (currentCommand.args && currentCommand.name !== "search")
            return {
              ...e,
              phrase: `${identifier}${currentCommand.name} ${e.phrase}`,
              icon: currentCommand.icon,
            };
          return e;
        })
      );
    };
    if (!duckduckDisabled) {
      document.addEventListener("autocomplete", acHandler, false);
      return () => {
        document.removeEventListener("autocomplete", acHandler);
      };
    }
  }, [term, identifier, duckduckDisabled]);

  const commandSuggestions = useMemo(() => {
    if (!suggestCommandsEnabled || !term) return [];
    return Object.keys(commands)
      .filter((e) => (identifier + e).includes(term.trim()))
      .sort()
      .sort(function (a, b) {
        if (a.startsWith(term) || (identifier + a).startsWith(term)) {
          if (b.startsWith(term) || (identifier + a).startsWith(term)) return 0;
          return -1;
        }
        return 1;
      })
      .slice(0, suggestCommandsCount)
      .map((phrase) => {
        return {
          phrase: identifier + phrase + " ",
          icon: commands[phrase].icon || defaultIcon,
        };
      });
  }, [
    suggestCommandsCount,
    commands,
    identifier,
    suggestCommandsEnabled,
    term,
    defaultIcon,
  ]);
  useEffect(() => {
    if (
      (currentCommand.name !== "search" && !currentCommand.args) ||
      currentCommand.recommended
    ) {
      setDuckDuckDisabled(true);
    } else {
      setDuckDuckDisabled(false);
    }
    if (duckduckDisabled) return;

    let input = term;
    if (currentCommand.args) input = currentCommand.args;
    const url =
      "https://duckduckgo.com/ac/?callback=autocompleteCallback&q=" + input;
    const script = document.createElement("script");
    try {
      script.src = url;
    } catch (error) {}
    let timeoutId, appended;

    setDuckDuckAc([]);
    if (input) {
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 200);
    }
    return () => {
      if (input) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [term, suggestCommandsEnabled, duckduckDisabled]);

  const mapedRecommended = useMemo(
    () =>
      (currentCommand.recommended || [])
        .map((e) => {
          return {
            ...e,
            phrase: identifier + currentCommand.name + " " + e?.phrase,
            icon: e?.icon || currentCommand.icon,
          };
        })
        .sort()
        .sort(function (a, b) {
          if (a.phrase.startsWith(term)) {
            if (b.phrase.startsWith(term)) return 0;
            return -1;
          }
          return 1;
        }),
    [currentCommand.name, currentCommand.recommended, identifier, term]
  );
  return useMemo(
    () =>
      [...commandSuggestions, ...mapedRecommended, ...duckDuckAc]
        .filter((e) => !term.includes(e.phrase))
        .slice(0, 8)
        .map((e) => ({ ...e, key: nanoid(10) })),
    [duckDuckAc, commandSuggestions]
  );
};

export default AutocompleteLogic;
