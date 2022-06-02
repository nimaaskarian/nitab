import { useContext, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CommandsContext from "context/CommandsContext";
import CurrentCommandContext from "context/CurrentCommandContext";
import { nanoid } from "nanoid";
import axios from "axios";

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

  const commandSuggestions = useMemo(() => {
    if (!suggestCommandsEnabled || !term) return [];
    return Object.keys(commands)
      .filter((e) => (identifier + e).toLowerCase().includes(term.trim()))
      .sort()
      .sort(function (a, b) {
        if (
          a.startsWith(term) ||
          (identifier + a).toLowerCase().startsWith(term)
        ) {
          if (
            b.startsWith(term) ||
            (identifier + a).toLowerCase().startsWith(term)
          )
            return 0;
          return -1;
        }
        return 1;
      })
      .slice(0, suggestCommandsCount)
      .map((phrase) => {
        return {
          phrase: identifier + phrase + " ",
          icon: commands[phrase].icon || defaultIcon,
          color: commands[phrase].color || true,
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

  const mapCallback = (
    recommend,
    index,
    ar,
    icons = [recommend.icon, currentCommand.icon],
    parent = ""
  ) => {
    const phrase =
      identifier + currentCommand.name + parent + " " + recommend?.phrase;
    const icon = icons.find((e) => !!e);

    if (
      !ar.some((e) =>
        term.startsWith(
          identifier + currentCommand.name + parent + " " + e.phrase
        )
      )
    ) {
      return {
        ...recommend,
        phrase,
        icon,
      };
    }
    if (
      recommend.recommended &&
      ar.find((e) =>
        term.startsWith(
          identifier + currentCommand.name + parent + " " + e.phrase
        )
      ) === recommend
    )
      return recommend.recommended.flatMap((r, index, ar) =>
        mapCallback(
          r,
          index,
          ar,
          [recommend.recommended.icon, ...icons],
          parent + " " + recommend.phrase
        )
      );
    return [];
  };
  const mappedRecommended = useMemo(
    () =>
      (
        (typeof currentCommand.recommended === "function" &&
          currentCommand.recommended()) ||
        currentCommand.recommended ||
        []
      )
        .flatMap(mapCallback)
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
      [...commandSuggestions, ...mappedRecommended]
        .filter((e) => !term.includes(e.phrase))
        .slice(0, 8)
        .map((e) => ({ ...e, key: nanoid(10) })),
    [commandSuggestions]
  );
};

export default AutocompleteLogic;
