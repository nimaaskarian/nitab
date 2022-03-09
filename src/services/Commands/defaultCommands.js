/*global chrome*/

import setBackground from "services/Images/setBackground";
import * as actions from "store/actions";
import store from "store";

const defaultCommands = {
  date() {
    return () => () => {
      store.dispatch(actions.toggleDateActive());
    };
  },
  w() {
    return () => () => {
      store.dispatch(actions.toggleWeatherActive());
      store.dispatch(actions.setTerm(""));
    };
  },
  clock(input) {
    if (input) {
      const [position, align] = input.toLowerCase().split(/\s/);
      if (position && align)
        return () => () => {
          store.dispatch(actions.setClockPosition(position));
          store.dispatch(
            actions.setClockAlign(
              ["end", "start"].includes(align) ? "flex-" + align : align
            )
          );
          store.dispatch(actions.setTerm(""));
        };
    }
  },
  font(input) {
    return () => () => store.dispatch(actions.setFont(input));
  },
  todo(input) {
    return () => () => store.dispatch(actions.addTodo(input));
  },
  par(input) {
    if (!parseFloat(input))
      return () => () => store.dispatch(actions.toggleIsParallax());
    return () => () =>
      store.dispatch(actions.setParallaxFactor(parseFloat(input)));
  },
  c(input) {
    const sums = {
      his: "history",
      ext: "extensions",
      set: "settings",
      [""]: "version",
    };
    return () =>
      async ({ altKey }) => {
        const url = "chrome://" + (sums[input] || input);
        if (altKey) {
          chrome.tabs.getCurrent(({ id, index }) => {
            chrome.tabs.create({
              url,
              index,
            });
            chrome.tabs.remove(id);
          });
        } else chrome.tabs.create({ url });
      };
  },
  iden(input) {
    if (input.trim())
      return () => () => store.dispatch(actions.setIndentifier(input.trim()));
  },
  exp() {
    return () => () => store.dispatch(actions.exportData());
  },
  imp() {
    return () => () => store.dispatch(actions.importData());
  },
  mag() {
    return () => () => store.dispatch(actions.toggleMagnify());
  },
  gr() {
    return () => () => store.dispatch(actions.toggleGradient());
  },
  ac(input) {
    return () => () => {
      if (!+input && input !== "0")
        store.dispatch(actions.toggleIsAcCommands());
      else store.dispatch(actions.setAcCommands(+input));
    };
  },
  bl(input) {
    const [notTerminal, terminal, setting] = input.split(/\s/g);
    return () => () =>
      store.dispatch(
        actions.setBlur({
          terminal: terminal || 0,
          notTerminal: notTerminal || 0,
          setting: setting || "10",
        })
      );
  },
  br(input) {
    const [notTerminal, terminal, setting] = input.split(/\s/g);
    return () => () =>
      store.dispatch(
        actions.setBrightness({
          terminal: terminal || 1,
          notTerminal: notTerminal || 1,
          setting: setting || ".8",
        })
      );
  },
  bg(input) {
    if (input) return () => () => setBackground(input);
  },
  fg: {
    function(input) {
      if (input) {
        let color, isOvr;
        if (input === "default") color = "white";
        if (input === "auto")
          return () => () => store.dispatch(actions.setIsForegoundAuto(true));

        color = input.replace(/ovr\s/, "");
        isOvr = input.includes("ovr");

        return () => () => {
          store.dispatch(actions.setForeground({ color, isOvr }));
          store.dispatch(actions.setIsForegoundAuto(false));
        };
      }
    },
  },
  un(input) {
    if (input)
      return () => () => {
        store.dispatch(actions.setUnsplash(input));
        store.dispatch(actions.setBackground("unsplash"));
      };
    return () => "https://unsplash.com/collections";
  },
  commandCl(input) {
    if (input === "CONFIRM")
      return () => () => store.dispatch(actions.clearCommands());
  },
  command: {
    function(input) {
      let [commandName, ...commandFunctions] = input
        .replace(/icon:".*"/g, "")
        .replace(/color:".*"/g, "")
        .split(/\s/g)
        .filter((e) => !!e);
      const icon = (/(?<=icon:")[^"]*(?=")/g.exec(input) || [])[0];
      const color = (/(?<=color:")[^"]*(?=")/g.exec(input) || [])[0];
      // if (icon) {
      //   document.querySelector(
      //     ".terminal-output"
      //   ).className = `terminal-output ${icon}`;
      // } else {
      //   document.querySelector(".terminal-output").className =
      //     "terminal-output fontawe";
      // }

      if (
        ["command", "commandCl"].includes(commandName) ||
        !commandFunctions.length
      )
        return;

      return () => {
        switch (commandFunctions[0].toLowerCase()) {
          case "delete":
            return () => store.dispatch(actions.deleteCommand(commandName));
          case "add":
            return () =>
              store.dispatch(
                actions.addToCommand(commandName, commandFunctions.delete(0))
              );
          case "remove":
            return () =>
              store.dispatch(
                actions.removeFromCommand(commandName, commandFunctions)
              );
          default:
            return () =>
              store.dispatch(
                actions.addCommand(commandName, commandFunctions, icon, color)
              );
        }
      };
    },
  },
  rr: () => () => () => store.dispatch(actions.resetStorage()),
  url: {
    function(input) {
      return () => {
        if (
          !input.match(/^http[s]?:\/\//i) &&
          !input.match(/^((..?)?\/)+.*/i)
        ) {
          input = "http://" + input;
        }
        return input;
      };
    },
    color: "#037fec",
    icon: "fas fa-globe",
  },
  imdb(input) {
    if (input)
      return () => {
        return "https://www.imdb.com/find?q=" + input;
      };
    else
      return () => {
        return "https://www.imdb.com/";
      };
  },
  stack(input) {
    if (input)
      return () => {
        return "https://stackoverflow.com/search?q=" + input;
      };
    else
      return () => {
        return "https://stackoverflow.com";
      };
  },
  mo(input) {
    if (input)
      return () => {
        return "https://www.f2m.site/?s=" + input;
      };
    else
      return () => {
        return "https://www.f2m.site/";
      };
  },
  t() {
    return () => {
      return "https://webz.telegram.org/";
    };
  },
  r(input) {
    if (!input)
      return () => {
        return "https://www.reddit.com/";
      };
    else
      return () => {
        return "https://www.reddit.com/r/" + input;
      };
  },
  sp(input) {
    if (!input)
      return () => {
        return "https://open.spotify.com/";
      };
    else
      return () => {
        return "https://open.spotify.com/search/" + input;
      };
  },
  dis() {
    return () => {
      return "https://discord.com/channels/@me";
    };
  },
  search: {
    function(input) {
      try {
        if (chrome.search.query)
          return () =>
            ({ altKey }) => {
              chrome.search.query({
                disposition: altKey ? "CURRENT_TAB" : "NEW_TAB",
                text: input,
              });
            };
      } catch (error) {}
      return defaultCommands.g.function(input);
    },
    icon: "fal fa-search",
  },
  g: {
    function(input) {
      return () => {
        return "https://www.google.com/search?q=" + input;
      };
    },
  },
  b(input) {
    let [title, url, parentId] = input.split(/\s/g);
    let tempObj;
    if (title && url) {
      tempObj = {
        url: defaultCommands.url.function(url)(),
        title,
        parentId: parentId || "1",
      };
    }
    return () => () => {
      chrome.bookmarks.create(tempObj);
    };
  },
  tr(input) {
    if (input) {
      let inputLang;
      let text;
      let outputLang;
      if (input.split(",").length === 2) {
        inputLang = input.split(",")[0];
        text = input.split(",")[1];
        outputLang = "en";
      } else if (input.split(",").length === 3) {
        inputLang = input.split(",")[0];
        outputLang = input.split(",")[1];
        text = input.split(",")[2];
      } else {
        inputLang = "en";
        outputLang = "fa";
        text = input;
      }

      return () => {
        return `https://translate.google.com/?sl=${inputLang}&tl=${outputLang}&text=${encodeURI(
          text
        )}&op=translate`;
      };
    } else {
      return () => {
        return "https://translate.google.com/";
      };
    }
  },
  taskbar() {
    return () => () => store.dispatch(actions.toggleTaskbarEdit());
  },
};

export default defaultCommands;
