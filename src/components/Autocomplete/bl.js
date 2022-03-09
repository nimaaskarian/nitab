import { useContext, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CommandsContext from "context/CommandsContext";
import CurrentCommandContext from "context/CurrentCommandContext";
import { setAc } from "store/actions";
const AutocompleteLogic = () => {
  const currentCommand = useContext(CurrentCommandContext);
  const { commands } = useContext(CommandsContext);
  const term = useSelector(({ ui }) => ui.term, shallowEqual);
  const acCommands = useSelector(({ data }) => data.acCommands, shallowEqual);
  const isAcCommands = useSelector(
    ({ data }) => data.isAcCommands,
    shallowEqual
  );
  const identifier = useSelector(({ data }) => data.identifier);
  const dispatch = useDispatch();
  useEffect(() => {
    const iden = identifier === "NONE" ? "" : identifier;
    let commandsSuggestions = [];
    if (isAcCommands)
      commandsSuggestions = Object.keys(commands)
        .filter((e) => (iden + e).includes(term))
        .sort()
        .sort(function (a, b) {
          if (a.startsWith(term)) {
            if (b.startsWith(term)) return 0;
            return -1;
          }
          return 1;
        })
        .slice(0, acCommands)
        .map((phrase) => {
          return {
            phrase: iden + phrase,
            icon: commands[phrase].icon || `fal fa-terminal`,
          };
        });
    const acHandler = ({ ac }) => {
      dispatch(
        setAc(
          [...commandsSuggestions, ...ac]
            .filter(({ phrase }) => phrase !== term)
            .slice(0, 8)
        )
      );
    };
    document.addEventListener("autocomplete", acHandler, false);
    return () => {
      document.removeEventListener("autocomplete", acHandler);
    };
  }, [term, commands, identifier, isAcCommands, acCommands]);

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

    dispatch(setAc([]));
    if (term) {
      timeoutId = setTimeout(() => {
        document.body.appendChild(script);
        appended = true;
      }, 120);
    }
    return () => {
      if (term) {
        clearTimeout(timeoutId);
        if (appended) document.body.removeChild(script);
      }
    };
  }, [term, isAcCommands]);
};

export default AutocompleteLogic;
