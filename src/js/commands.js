/*global chrome*/

import localforage from "localforage";
import { isUrl } from "../utils";
import {
  addCommand,
  addToCommand,
  deleteCommand,
  removeFromCommand,
  resetStorage,
  exportData,
  importData,
  toggleTaskbarEdit,
  setIndentifier,
  setForeground,
  setUnsplash,
  setBrightness,
  setBlur,
  toggleMagnify,
  toggleGradient,
  setClockAlign,
  setClockPosition,
  setTerm,
  addTodo,
  setFont,
  toggleIsParallax,
  setParallaxFactor,
  clearCommands,
  setIsForegoundAuto,
} from "../actions";

import { setBackground } from "../utils";
import { store } from "../store";

const s = {
  iden: {
    des: "Changes command identifier",
    def: "/",
    current: () => {},
  },
  clock: {
    des: "Changes clock position and align",
    def: "center center",
    current: () => {},
  },
  font: {
    des: "Changes font of newtab's texts",
    def: "Inconsolata",
    current: () => {},
  },
  par: {
    des: "Toggles Background's Mouse Parallex effect (use par [number] to set zoom percentage",
    def: "off",
    current: () => {},
  },
  c: {
    des: "Short term for 'chrome://'. ext: extension, set: settings, his: history",
  },
  exp: {
    des: "Exports your newtab settings as a .JSON file. (backgrounds except for urls and colors(solid and gradient) cannot be saved",
  },
  imp: {
    des: "Opens a file selection menu to select your exported .JSON file and import its settings",
  },
  mag: {
    des: "Toggles magnification of your Taskbar",
    def: "on",
    current: () => {},
  },
  gr: {
    des: "Toggles Taskbar and Result-Mode background, and Terminals background gradient",
    def: "on",
    current: () => {},
  },
  bl: {
    des: "Changes blur of background. bl [Main:number] [Terminal:number] [SettingGUI:number]",
    def: "0 0 10",
    current: () => {},
  },
  br: {
    des: "Changes brightness of background. (1 or 100% = normal) br [Main:number] [Terminal:number] [SettingGUI:number]",
    def: "1 1 0.8",
    current: () => {},
  },
  bg: {
    des: "Changes background. bg [background:cssColor,rgb,hsl,hex,gradient,url('example.com/path/to/background.jpg')",
    def: "#333",
    current: () => {},
  },
  fg: {
    des: "Changes foreground color. ovr will make color to never change. fg ovr(optional) [color:cssColor,rgb,hsl,hex]",
    def: "white",
    current: () => {},
  },
  commandCl: {
    des: "Clears all commands that you've added. commandCL CONFIRM (CONFIRM needs to be in Capital letters)",
  },
  command: {
    des: "For Adding, Deleting or changing a command. command [commandName:string] [URL(s)]",
  },
};
const getAll = async () => {
  let output = {};
  const keys = await localforage.keys();
  for (let key of keys) {
    const value = await localforage.getItem(key);
    output[key] = value;
  }
  return output;
};
const defaultCommands = {
  clock(input) {
    if (input) {
      const [position, align] = input.toLowerCase().split(/\s/);
      if (position && align)
        return () => () => {
          store.dispatch(setClockPosition(position));
          store.dispatch(
            setClockAlign(
              ["end", "start"].includes(align) ? "flex-" + align : align
            )
          );
          store.dispatch(setTerm(""));
        };
    }
  },
  font(input) {
    return () => () => store.dispatch(setFont(input));
  },
  todo(input) {
    return () => () => store.dispatch(addTodo(input));
  },
  par(input) {
    if (!parseFloat(input))
      return () => () => store.dispatch(toggleIsParallax());
    return () => () => store.dispatch(setParallaxFactor(parseFloat(input)));
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
      return () => () => store.dispatch(setIndentifier(input.trim()));
  },
  exp() {
    return () => () => store.dispatch(exportData());
  },
  imp() {
    return () => () => store.dispatch(importData());
  },
  mag() {
    return () => () => store.dispatch(toggleMagnify());
  },
  gr() {
    return () => () => store.dispatch(toggleGradient());
  },
  bl(input) {
    const [notTerminal, terminal, setting] = input.split(/\s/g);
    return () => () =>
      store.dispatch(
        setBlur({
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
        setBrightness({
          terminal: terminal || 1,
          notTerminal: notTerminal || 1,
          setting: setting || ".8",
        })
      );
  },
  bg(input) {
    if (input) return () => () => setBackground(input);
  },
  fg(input) {
    if (input) {
      if (input === "default") input = "white";
      if (input === "auto")
        return () => () => store.dispatch(setIsForegoundAuto(true));
      const [first, second] = input.includes("ovr")
        ? ["ovr", input.replace(/ovr\s/, "")]
        : [];
      if (first && second && first === "ovr") input = second + " !important";

      return () => () => {
        store.dispatch(setForeground(input));
        store.dispatch(setIsForegoundAuto(false));
      };
    }
  },
  un(input) {
    if (input)
      return () => () => {
        store.dispatch(setUnsplash(input));
        store.dispatch(setBackground("unsplash"));
      };
    return () => "https://unsplash.com/collections";
  },
  commandCl(input) {
    if (input === "CONFIRM") return () => () => store.dispatch(clearCommands());
  },
  command(input) {
    let [commandName, ...commandFunctions] = input
      .replace(/icon:".*"/g, "")
      .split(/\s/g)
      .filter((e) => !!e);
    const icon = (/(?<=icon:").*(?=")/g.exec(input) || [])[0];
    if (icon) {
      document.querySelector(
        ".terminal-output"
      ).className = `terminal-output ${icon}`;
    } else {
      document.querySelector(".terminal-output").className =
        "terminal-output fontawe";
    }

    if (
      ["command", "commandCl"].includes(commandName) ||
      !commandFunctions.length
    )
      return;
    console.log(icon, commandFunctions);
    return () => {
      switch (commandFunctions[0].toLowerCase()) {
        case "delete":
          return () => store.dispatch(deleteCommand(commandName));
        case "add":
          return () =>
            store.dispatch(
              addToCommand(commandName, commandFunctions.delete(0))
            );
        case "remove":
          return () =>
            store.dispatch(removeFromCommand(commandName, commandFunctions));
        default:
          return () =>
            store.dispatch(addCommand(commandName, commandFunctions, icon));
      }
    };
  },
  rr: () => () => () => store.dispatch(resetStorage()),
  url(input) {
    return () => {
      if (!input.match(/^http[s]?:\/\//i) && !input.match(/^((..?)?\/)+.*/i)) {
        input = "http://" + input;
      }
      return input;
    };
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
  math(input) {
    if (input)
      return () => {
        return "https://math.microstackt.com/en";
      };
    else
      return () => {
        return "https://www.symbolab.com/";
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
        return "https://www.film2media.mobi/?s=" + input;
      };
    else
      return () => {
        return "https://www.film2media.mobi/";
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
  gate() {
    return () => {
      return "http://192.168.1.1";
    };
  },
  dis() {
    return () => {
      return "https://discord.com/channels/@me";
    };
  },
  search(input) {
    // if (chrome)
    //   if (chrome.search)
    //     if (chrome.search.query)
    //       return () =>
    //         ({ altKey }) => {
    //           chrome.search.query({
    //             disposition: altKey ? "CURRENT_TAB" : "NEW_TAB",
    //             text: input,
    //           });
    //         };
    return this.g(input);
  },
  g(input) {
    return () => {
      return "https://www.google.com/search?q=" + input;
    };
  },
  des(input) {
    if (input) {
      return () => {
        return "https://www.desmos.com/scientific";
      };
    } else {
      return () => {
        return "https://www.desmos.com/calculator";
      };
    }
  },
  wa() {
    return () => {
      return "https://web.whatsapp.com/";
    };
  },
  eu(input) {
    if (input)
      return () => {
        return "https://projecteuler.net/problem=" + input;
      };
    else
      return () => {
        return "https://projecteuler.net/archives";
      };
  },
  yt(input) {
    if (input)
      return () => {
        return (
          "https://www.youtube.com/results?search_query=" + encodeURI(input)
        );
      };
    else
      return () => {
        return "https://www.youtube.com";
      };
  },
  w3(input) {
    if (input) {
      return () => {
        return (
          "https://www.google.com/search?q=" + input + " site:w3schools.com"
        );
      };
    } else {
      return () => {
        return "https://www.w3schools.com/";
      };
    }
  },
  rgx(input) {
    if (input) {
      return () => {
        return "https://www.google.com/search?q=" + input + " site:regexr.com";
      };
    } else {
      return () => {
        return "https://regexr.com/";
      };
    }
  },
  fa(input) {
    if (input) {
      return () => {
        return "https://fontawesome.com/v6.0/icons?q=" + input;
      };
    } else {
      return () => {
        return "https://fontawesome.com/v6.0/icons";
      };
    }
  },
  ico() {
    return () => {
      return "https://icomoon.io/app/#/select";
    };
  },
  st(input) {
    if (!input)
      return () => {
        return "https://store.steampowered.com/";
      };
    else
      return () => {
        return "https://store.steampowered.com/search/?term=" + input;
      };
  },
  sch() {
    return () => {
      return "http://student.mat.ir";
    };
  },
  b(input) {
    let [title, url, parentId] = input.split(/\s/g);
    let tempObj;
    if (title && url) {
      tempObj = {
        url: this.url(url)(),
        title,
        parentId: parentId || "1",
      };
    }
    return () => () => {
      chrome.bookmarks.create(tempObj);
    };
  },
  // js(input) {
  //   $("#terminal-output").html(
  //     `<span class="js fontawe" style="margin:0 10;"></span>`
  //   );
  //   try {
  //     return () => {
  //       $("#terminal-output").html(
  //         JSON.stringify(eval(input)) +
  //           `<span class="js fontawe" style="margin:0 10;"></span>`
  //       );
  //     };
  //   } catch (error) {
  //     throw new error();
  //   }
  // },
  s(input) {
    if (input)
      if (input.split(" ").length >= 2) {
        let temp = "";
        for (let index in input.split(" "))
          if (parseInt(index)) temp += " " + input.split(" ")[index];

        return () => {
          return `https://www.google.com/search?q=${temp} site:${
            input.split(" ")[0]
          }`;
        };
      } else return () => {};
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
  y(input) {
    return () => {
      return "https://search.yahoo.com/search;_ylc=--?p=" + encodeURI(input);
    };
  },
  sft(input) {
    if (input) {
      return () => {
        return "https://www.google.com/search?q=" + input + " site:soft98.ir";
      };
    } else {
      return () => {
        return "https://soft98.ir/";
      };
    }
  },
  dic(input) {
    if (/[\u0600-\u06FF\s]+/.test(input))
      return () => {
        return (
          "https://abadis.ir/?lntype=fatoen,dehkhoda,fatofa,moeen,amid,name,wiki,wikiislamic&word=" +
          encodeURI(input)
        );
      };
    else
      return () => {
        return "https://www.dictionary.com/browse/" + input;
      };
  },
  al(input) {
    return () => {
      return "http://alaatv.com/";
    };
  },
  // mu(input) {
  //   if (input === "c") {
  //     return () => {
  //       return "http://musicator.ir:2082/";
  //     };
  //   } else if (parseInt(input)) {
  //     return () => {
  //       return "https://musicator.ir/player/index.php?page=" + input;
  //     };
  //   } else {
  //     return () => {
  //       return "https://musicator.ir/";
  //     };
  //   }
  // },
  taskbar() {
    return () => () => store.dispatch(toggleTaskbarEdit());
  },
};
const regex = (identifier) => {
  switch (identifier) {
    case "NONE":
      return { main: new RegExp(".*"), replace: "" };
    case ".":
      identifier = `\.`;
    default:
      break;
  }
  const main = new RegExp(`^(?=${identifier}).*`, "g");
  const replace = new RegExp("^" + identifier, "g");

  return { main, replace };
};
const noCommand = (string) => {
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
};
export const termToCommand = (string, identifier, commands) => {
  let name, args;
  const { main, replace } = regex(identifier);
  if (main.test(string)) {
    let values = string.replace(replace, "").split(" ");
    name = values[0];
    args = "";

    values.shift();
    for (let value of values) {
      args += args ? " " + value : "" + value;
    }
    if (!commands[name]) {
      [name, args] = noCommand(string);
    }
  } else if (string) {
    [name, args] = noCommand(string);
  }

  return { name, args };
};
export default defaultCommands;
