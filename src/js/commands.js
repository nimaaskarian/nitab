import localforage from "localforage";
import isUrl from "./isUrl";
const getAll = async () => {
  let output = {};
  const keys = await localforage.keys();
  for (let key of keys) {
    const value = await localforage.getItem(key);
    output[key] = value;
  }
  return output;
};
const setAll = async (input) => {
  if (typeof input !== "object") return;
  Object.keys(input).forEach((key) => {
    const value = input[key];
    if (typeof value === "object" && value !== null) {
      if (!Object.keys(value).length) return;
    } else if ([null, undefined].includes(value)) return;
    localforage.setItem(key, value);
  });
};
/*global chrome*/
const defaultCommands = {
  clock(input) {
    if (input) {
      const [type, value] = input.toLowerCase().split(/\s/);
      if (type && value)
        return () => {
          switch (type) {
            case "align":
              localforage.setItem(
                "clockAlign",
                ["end", "start"].includes(value) ? "flex-" + value : value
              );
            case "pos":
              localforage.setItem("clockPos", value);
              break;

            default:
              {
                localforage.setItem("clockPos", type);
                localforage.setItem(
                  "clockAlign",
                  ["end", "start"].includes(value) ? "flex-" + value : value
                );
              }
              break;
          }
        };
    }
  },
  font(input) {
    return async () => {
      localforage.setItem("font", input || "Inconsolata");
    };
  },
  par(input) {
    if (!input)
      return async () => {
        const res = await localforage.getItem("parallex");
        console.log(res, !res);
        localforage.setItem("parallex", !res);
      };
    return () => {
      localforage.setItem("parallex-factor", parseInt(input));
    };
  },
  c(input) {
    const sums = {
      his: "history",
      ext: "extensions",
      set: "settings",
      [""]: "version",
    };
    return async ({ altKey }) => {
      const url = "chrome://" + (sums[input] || input);
      if (altKey) {
        const { id, index } = await chrome.tabs.getCurrent();
        chrome.tabs.create({
          url,
          index,
        });
        chrome.tabs.remove(id);
      } else chrome.tabs.create({ url });
    };
  },
  iden(input) {
    if (input.trim()) return () => localforage.setItem("indetifier", input);
  },
  exp() {
    return async () => {
      const data = await getAll();

      const type = "text/json";
      const filename = "Exported-data.json";
      var file = new Blob([JSON.stringify(data)], { type });
      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        // Others
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    };
  },
  imp() {
    return async () => {
      const [handle] = await window.showOpenFilePicker();
      const file = await handle.getFile();
      const fileReader = new window.FileReader();

      fileReader.readAsText(file);
      fileReader.onload = ({ target }) => {
        setAll(JSON.parse(target.result));
      };
    };
  },
  mag() {
    return async () => {
      const magnify = await localforage.getItem("magnify");
      localforage.setItem("magnify", !magnify);
    };
  },
  gr() {
    return async () => {
      const gr = await localforage.getItem("gradient");
      console.log(gr);
      localforage.setItem("gradient", !gr);
    };
  },
  bl(input) {
    const [notTerminal, terminal, setting] = input.split(/\s/g);

    return () =>
      localforage.setItem("blur", {
        terminal: terminal || 0,
        notTerminal: notTerminal || 0,
        setting: setting || "10",
      });
  },
  br(input) {
    const [notTerminal, terminal, setting] = input.split(/\s/g);

    return () =>
      localforage.setItem("brightness", {
        terminal: terminal || 1,
        notTerminal: notTerminal || 1,
        setting: setting || ".8",
      });
  },
  bg(input) {
    if (input) return () => localforage.setItem("background", input);
  },
  fg(input) {
    if (input) {
      if (input === "default")
        return () => {
          localforage.setItem("foreground", "white");
        };
      else {
        const [first, second] = input.split(/\s/g);
        if (first && second && first === "ovr")
          return () =>
            localforage.setItem("foreground", second + " !important");
        return () => localforage.setItem("foreground", input);
      }
    }
  },
  commandCl(input) {
    if (input === "CONFIRM") return () => localforage.setItem("commands", {});
  },
  command(input) {
    const [commandName, ...commandFunctions] = input.split(/\s/g);
    console.log(commandName, commandFunctions);
    if (["command", "commandCl"].includes(commandName)) return;
    if (!commandFunctions.length)
      return () => {
        window.location = "./index.html?command=true";
      };
    var _commands;
    (async () => {
      _commands = await localforage.getItem("commands");
    })();

    if (commandFunctions[0] === "DELETE")
      return () => {
        delete _commands[commandName];
        localforage.setItem("commands", _commands);
      };
    if (commandFunctions[0].toLowerCase() === "add")
      return () => {
        if (!_commands[commandName]) return;
        _commands[commandName] = [
          ..._commands[commandName],
          ...commandFunctions.slice(1),
        ];
        localforage.setItem("commands", _commands);
      };
    if (commandFunctions[0].toLowerCase() === "remove")
      return () => {
        if (!_commands[commandName]) return;

        let index = -1;
        commandFunctions.slice(1).forEach((e) => {
          console.log(parseInt(e) - 1);
          if (parseInt(e) + index >= 0) {
            _commands[commandName].splice(parseInt(e) + index, 1);
            index--;
          }
        });
        localforage.setItem("commands", _commands);
      };
    return () => {
      console.log(_commands);
      _commands[commandName] = commandFunctions;
      localforage.setItem("commands", _commands);
    };
  },
  url(input) {
    return () => {
      return (
        "https://" +
        input
          .replace(/www./g, "")
          .replace("https://", "")
          .replace("http://", "")
      );
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
    if (chrome.search)
      return ({ altKey }) => {
        chrome.search.query({
          disposition: altKey ? "CURRENT_TAB" : "NEW_TAB",
          text: input,
        });
      };
    else return this.g(input);
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
        return "https://fontawesome.com/icons?d=gallery&p=2&q=" + input;
      };
    } else {
      return () => {
        return "https://fontawesome.com/cheatsheet";
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
    return () => {
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
  mu(input) {
    if (input === "c") {
      return () => {
        return "http://musicator.ir:2082/";
      };
    } else if (parseInt(input)) {
      return () => {
        return "https://musicator.ir/player/index.php?page=" + input;
      };
    } else {
      return () => {
        return "https://musicator.ir/";
      };
    }
  },
  taskbar() {
    return () => {};
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
