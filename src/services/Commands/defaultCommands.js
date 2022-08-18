/*global chrome*/
import * as actions from "store/actions";
import store from "store";
import {
  addBackground,
  deleteBackground,
  setCurrentBackground,
  setImageLoaded,
  toggleIsBackgroundRandom,
  setIsFetchingImage,
  addTheme,
  setCurrentTheme,
  deleteTheme,
  setDarkTheme,
  setLightTheme,
  setTempIcon,
  toggleIsThemeRandom,
  setDefaultIcon,
  setSideMenuIndex,
  setTerm,
} from "store/actions";
import { unsplash } from "apis";
import axios from "axios";
import { addBlobAsBackground } from "services/Images";
import openFilePrompt, { types } from "services/openFilePrompt";
import { parseSurrounding } from "./dataToCommands";
function recommendations(phrases = [], recommended, icons = []) {
  return phrases.map((phrase, index) => ({
    phrase,
    icon: icons[index],
    recommended: (recommended || [])[0]?.phrase
      ? recommended
      : recommendations(recommended),
  }));
}
function checkIcon(timeout = 1500) {
  store.dispatch(setTempIcon("fa fa-check"));
  setTimeout(() => {
    store.dispatch(setTempIcon(""));
  }, timeout);
}
const defaultCommands = {
  date: {
    function() {
      return () => () => {
        store.dispatch(actions.toggleDateEnabled());
        store.dispatch(actions.setTerm(""));
      };
    },
    icon: "fa fa-calendar",
  },
  w: {
    function() {
      return () => () => {
        store.dispatch(actions.toggleWeatherEnabled());
        store.dispatch(actions.setTerm(""));
      };
    },
    icon: "fa fa-temperature-half",
  },
  clock: {
    function(input) {
      if (input) {
        const [position, align] = input.toLowerCase().split(/\s/);
        if (position || align)
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
    icon: "fa fa-clock",
    recommended: recommendations(
      ["center", "left", "right"],
      ["center", "start", "end"]
    ),
  },
  font: {
    function(input) {
      return () => () => store.dispatch(actions.setFont(input));
    },
    icon: "fa fa-font",
  },
  todo: {
    function(input) {
      if (!input)
        return () => () => {
          store.dispatch(setSideMenuIndex(2));
          store.dispatch(setTerm(""));
        };
      return () => () => {
        store.dispatch(actions.addTodo({ message: input }));
        const term = store.getState().ui.term;
        store.dispatch(actions.setTerm(term.replace(input, "")));
      };
    },
    icon: "far fa-circle-check",
  },
  par: {
    function(input) {
      const { current, list } = store.getState().data.themes;
      const currentTheme = list[current];

      const bgIndex = currentTheme.currentBackground;
      if (!parseFloat(input))
        return () => () => {
          store.dispatch(actions.toggleParallaxEnabled(bgIndex));
          checkIcon();
        };
      return () => () => {
        store.dispatch(actions.setParallaxFactor(bgIndex, parseFloat(input)));
        checkIcon();
      };
    },
  },
  c: {
    function(input) {
      const sums = {
        his: "history",
        ext: "extensions",
        set: "settings",
        "": "version",
      };
      return () =>
        async ({ altKey }) => {
          const url = "chrome://" + (sums[input] || input);
          if (altKey) {
            chrome?.tabs.getCurrent(({ id, index }) => {
              chrome?.tabs.create({
                url,
                index,
              });
              chrome?.tabs.remove(id);
            });
          } else chrome?.tabs.create({ url });
        };
    },
    icon: "fab fa-chrome",
    recommended: [{ phrase: "his" }, { phrase: "ext" }, { phrase: "set" }],
  },
  iden: {
    function(input) {
      return () => () => {
        store.dispatch(actions.setIdentifier(input.trim()));
        checkIcon();
      };
    },
    recommended: [{ phrase: "/" }, { phrase: "~" }, { phrase: "-" }],
  },
  exp: {
    function() {
      return () => () => store.dispatch(actions.exportData());
    },
    icon: "fa fa-file-export",
  },
  imp: {
    function() {
      return () => () => {
        openFilePrompt(({ target: { result } }) => {
          const dataKeys = Object.keys(store.getState().data);
          const data = JSON.parse(result);
          const filteredEntries = Object.entries(data)
            .map(([key, value]) => {
              if (dataKeys.includes(key)) return [key, value];
              return [key, null];
            })
            .filter(([key, value]) => !!value);

          store.dispatch(
            actions.importData(Object.fromEntries(filteredEntries))
          );
        });
      };
    },
    icon: "fa fa-file-import",
  },
  mag: {
    function() {
      return () => () => store.dispatch(actions.toggleTaskbarMagnify());
    },
    icon: "fa fa-magnifying-glass-plus",
  },
  // gr() {
  //   return () => () => store.dispatch(actions.toggleGradient());
  // },
  ac: {
    function(input) {
      return () => () => {
        if (!+input && input !== "0")
          store.dispatch(actions.toggleSuggestCommandsEnabled());
        else store.dispatch(actions.setSuggestCommandsCount(+input));
      };
    },
  },
  bl: {
    function(input) {
      const [notTerminal, terminal, setting] = input.split(/\s/g);
      const { current, list } = store.getState().data.themes;
      const currentTheme = list[current];

      const bgIndex = currentTheme.currentBackground;
      return () => () =>
        store.dispatch(
          actions.setBlur(bgIndex, {
            terminal: terminal || 0,
            notTerminal: notTerminal || 0,
            setting: setting || "10",
          })
        );
    },
    icon: "fa fa-droplet",
  },
  br: {
    function(input) {
      const [notTerminal, terminal, setting] = input.split(/\s/g);

      const { current, list } = store.getState().data.themes;
      const currentTheme = list[current];

      const bgIndex = currentTheme.currentBackground;

      return () => () =>
        store.dispatch(
          actions.setBrightness(bgIndex, {
            terminal: terminal || 1,
            notTerminal: notTerminal || 1,
            setting: setting || ".8",
          })
        );
    },
  },
  bg: {
    function(input) {
      if (!input) {
        return () => () =>
          openFilePrompt(
            (blobs) => {
              blobs.forEach((blob) => {
                addBlobAsBackground(
                  blob,
                  null,
                  blob.type.replace(/\/.*/, "") === "video" ? "video" : "id"
                );
              });
            },
            types.BLOB,
            "image/*,video/*",
            true
          );
      }
      if (input === "random") {
        return () => () => store.dispatch(toggleIsBackgroundRandom());
      }
      if (input === "un") {
        const { current, list } = store.getState().data.themes;
        const currentTheme = list[current];

        const collections = currentTheme.unsplashCollections;
        const getAndFetchBackground = async () => {
          let {
            data: { urls },
          } = await unsplash.get("/photos/random", {
            params: {
              collections,
            },
          });
          const metas = store.getState().data.backgrounds?.map((e) => e.meta);
          if (metas?.includes(urls.regular)) return getAndFetchBackground();
          store.dispatch(setIsFetchingImage(true));
          let blobResult = await axios.get(urls.regular, {
            responseType: "blob",
            onDownloadProgress: ({ loaded, total }) => {
              store.dispatch(setImageLoaded(loaded / total));
            },
          });
          store.dispatch(setIsFetchingImage(false));
          store.dispatch(setImageLoaded(0));

          addBlobAsBackground(blobResult.data, urls.regular);
        };

        return () => getAndFetchBackground;
      }
      const [first, second] = input.split(" ");
      if (+first || first === "0") {
        if (second === "delete")
          return () => () => store.dispatch(deleteBackground(+first));
        return () => () => store.dispatch(setCurrentBackground(+first));
      }

      if (input)
        return () => () => store.dispatch(addBackground({ cssValue: input }));
    },
    icon: "fa fa-image",
    recommended: () => {
      return [
        { phrase: "un" },
        { phrase: "random" },
        ...recommendations(
          store.getState().data.backgrounds.map((e, i) => i),
          ["delete"]
        ),
      ];
    },
  },
  themes: {
    function(input) {
      if (!input)
        return () => () => {
          store.dispatch(setSideMenuIndex(3));
          store.dispatch(setTerm(""));
        };
      const [type, arg] = input.split(/\s/);

      if (type === "add") {
        return () => () => store.dispatch(addTheme());
      }
      if (type === "random") {
        return () => () => store.dispatch(toggleIsThemeRandom());
      }
      if (+type || type === "0") {
        switch (arg) {
          case "delete":
            return () => () => {
              store.dispatch(deleteTheme(+type));
            };

          case "dark":
            return () => () => {
              if (type === "delete") store.dispatch(setDarkTheme(-1));
              else store.dispatch(setDarkTheme(+type));
              checkIcon();
            };

          case "light":
            return () => () => {
              if (type === "delete") store.dispatch(setDarkTheme(-1));
              else store.dispatch(setLightTheme(+type));
              checkIcon();
            };

          default:
            return () => () => {
              store.dispatch(setCurrentTheme(+type));
              checkIcon();
            };
        }
      }
    },
    recommended: () => {
      const themes = store.getState().data.themes.list;
      return [
        { phrase: "add" },
        ...recommendations(
          themes.map((e, i) => i),
          ["light", "dark", "delete"]
        ),
      ];
    },

    icon: "fa fa-paint-roller",
  },
  fg: {
    function(input) {
      if (input) {
        let color, isOvr;
        if (input === "default") color = "white";
        if (input === "auto")
          return () => () => store.dispatch(actions.setIsForegroundAuto(true));

        color = input.replace(/ovr\s/, "");
        isOvr = input.includes("ovr");

        return () => () => {
          store.dispatch(actions.setForeground({ color, isOvr }));
          store.dispatch(actions.setIsForegroundAuto(false));
        };
      }
    },
    icon: "fa fa-brush",
    recommended: [
      {
        phrase: "ovr ",
      },
    ],
  },
  un: {
    function(input) {
      const index = (/{\d+}/g.exec(input) || [])[0] || "0";
      const size = ((/{\w*}/g.exec(input) || [])[0] || "regular").replace(
        /{|}/g,
        ""
      );
      const query = input.replace(/{\d*\w*}/g, "").trim();


      const getAndFetchBackground = async () => {
        const {
          data: { results },
        } = await unsplash.get("/search/photos", {
          params: {
            query,
          },
        });
        const urls = results[index.replace(/{|}/g, "")]?.urls;
        if (!urls) return;
        console.log(urls);
        const metas = store.getState().data.backgrounds?.map((e) => e.meta);
        if (metas?.includes(urls[size])) return;
        store.dispatch(setIsFetchingImage(true));
        let blobResult = await axios.get(urls.regular, {
          responseType: "blob",
          onDownloadProgress: ({ loaded, total }) => {
            store.dispatch(setImageLoaded(loaded / total));
          },
        });
        store.dispatch(setIsFetchingImage(false));
        store.dispatch(setImageLoaded(0));
        addBlobAsBackground(blobResult.data, urls[size]);
      };
      return () => getAndFetchBackground;
    },
    icon: "fab fa-unsplash",
  },
  unCol: {
    function(input) {
      if (input)
        return () => () => {
          store.dispatch(actions.setUnsplashCollections(input));
          defaultCommands.bg.function("un")()();
        };
      return () => "https://unsplash.com/collections";
    },
    icon: "fab fa-unsplash",
  },
  commandCl: {
    function(input) {
      if (input === "CONFIRM")
        return () => () => store.dispatch(actions.clearCommands());
    },
    icon: "fa fa-trash",
    recommended: [
      {
        phrase: "CONFIRM",
      },
    ],
  },
  default: {
    function(input) {
      store.dispatch(setDefaultIcon(input));
    },
  },
  command: {
    function(input) {
      const { rest, results } = parseSurrounding(input, "%");
      console.log(rest, results);
      let [commandName, ...commandFunctions] = rest
        .replace(/icon:".*"/g, "")
        .replace(/color:".*"/g, "")
        .split(/\s/g)
        .filter((e) => !!e);
      const icon = (/(?<=icon:")[^"]*(?=")/g.exec(rest) || [])[0];
      const color = (/(?<=color:")[^"]*(?=")/g.exec(rest) || [])[0];
      console.log(rest, results);
      return () => {
        switch ((commandFunctions[0] || "").toLowerCase()) {
          case "delete":
            return () => store.dispatch(actions.deleteCommand(commandName));
          case "add":
            return () =>
              store.dispatch(
                actions.addToCommand(commandName, [
                  ...commandFunctions.delete(0),
                  ...results,
                ])
              );
          case "remove":
            return () =>
              store.dispatch(
                actions.removeFromCommand(commandName, commandFunctions)
              );
          default:
            return () =>
              store.dispatch(
                actions.addCommand(
                  commandName,
                  [...commandFunctions, ...results],
                  icon,
                  color
                )
              );
        }
      };
    },
    recommended: () => {
      return [
        ...recommendations(
          Object.keys(store.getState().data.commands)
            .map((e, i) => e)
            .filter((e) => e.startsWith(argString)),
          ["delete", 'icon:"fa fa-"', 'color:"#"', "add", "remove"]
        ),
      ];
    },
  },
  reset: {
    function(input) {
      if (input === "CONFIRM") {
        return () => () => store.dispatch(actions.resetStorage());
      }
    },
    icon: "fa fa-trash",
    recommended: [{ phrase: "CONFIRM" }],
  },
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
    icon: "fa fa-globe",
  },
  search: {
    function(text) {
      if (chrome?.search?.query)
        return () =>
          ({ altKey }) => {
            chrome?.search?.query({
              disposition: altKey ? "CURRENT_TAB" : "NEW_TAB",
              text,
            });
          };

      return defaultCommands.g.function(text);
    },
    icon: "fa fa-search",
  },
  g: {
    function(input) {
      return () => {
        return "https://www.google.com/search?q=" + input;
      };
    },
    icon: "fab fa-google",
  },
  b: {
    function(input) {
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
        chrome?.bookmarks.create(tempObj);
      };
    },
    icon: "fa fa-bookmark",
  },
  taskbar: {
    function() {
      return () => () => {
        store.dispatch(actions.setSideMenuIndex(1));
        store.dispatch(actions.setTerm(""));
      };
    },
  },
};

export default defaultCommands;
