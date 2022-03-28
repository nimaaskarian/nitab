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
} from "store/actions";
import { unsplash } from "apis";
import axios from "axios";
import { addBlobAsBackground } from "services/Images";

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
    recommended: [
      { phrase: "center" },
      { phrase: "left" },
      { phrase: "right" },
    ],
  },
  font: {
    function(input) {
      return () => () => store.dispatch(actions.setFont(input));
    },
    icon: "fa fa-font",
  },
  todo: {
    function(input) {
      return () => () => {
        checkIcon();
        store.dispatch(actions.addTodo({ message: input }));
      };
    },
    icon: "clipboard-list-check",
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
        store.dispatch(actions.setIndentifier(input.trim()));
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
        const fileReader = new window.FileReader();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.style.opacity = "0";
        input.style.position = "absolute";
        input.style.bottom = "0";
        document.body.appendChild(input);
        input.click();
        input.addEventListener("change", () => {
          if (!input.files.length || input.files.length > 1) return;
          fileReader.readAsText(input.files[0]);
          fileReader.onload = ({ target: { result } }) => {
            const dataKeys = Object.keys(store.getState().data);
            const data = JSON.parse(result);
            const filteredEnteries = Object.entries(data)
              .map(([key, value]) => {
                if (dataKeys.includes(key)) return [key, value];
                return [key, null];
              })
              .filter(([key, value]) => !!value);

            store.dispatch(
              actions.importData(Object.fromEntries(filteredEnteries))
            );
          };
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
          } = await unsplash.get("/random", {
            params: {
              collections,
            },
          });
          const metas = store.getState().data.backgrounds?.map((e) => e.meta);
          if (metas?.includes(urls.full)) return getAndFetchBackground();
          store.dispatch(setIsFetchingImage(true));
          let blobResult = await axios.get(urls.full, {
            responseType: "blob",
            onDownloadProgress: ({ loaded, total }) => {
              store.dispatch(setImageLoaded(loaded / total));
            },
          });
          store.dispatch(setIsFetchingImage(false));
          store.dispatch(setImageLoaded(0));

          addBlobAsBackground(blobResult.data, urls.full);
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
    recommended: [{ phrase: "un" }, { phrase: "random" }],
  },
  themes: {
    function(input) {
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
              switch (type) {
                case "light":
                  store.dispatch(setLightTheme(-1));
                  break;
                case "dark":
                  store.dispatch(setDarkTheme(-1));
                  break;
                default:
                  store.dispatch(deleteTheme(+type));
                  break;
              }
              checkIcon();
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
    recommended: [
      {
        phrase: "add",
        icon: "fa fa-plus",
      },
      {
        phrase: "0 delete",
      },
    ],
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
    icon: "fa fa-brush",
    recommended: [
      {
        phrase: "ovr ",
      },
    ],
  },
  un: {
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
  command: {
    function(input) {
      let [commandName, ...commandFunctions] = input
        .replace(/icon:".*"/g, "")
        .replace(/color:".*"/g, "")
        .split(/\s/g)
        .filter((e) => !!e);
      const icon = (/(?<=icon:")[^"]*(?=")/g.exec(input) || [])[0];
      const color = (/(?<=color:")[^"]*(?=")/g.exec(input) || [])[0];
      return () => {
        switch ((commandFunctions[0] || "").toLowerCase()) {
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
  rr: {
    function(input) {
      if (input === "CONFIRM") {
        return () => () => store.dispatch(actions.resetStorage());
      }
    },
    icon: "fa fa-trash",
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
      return () => () => store.dispatch(actions.toggleTaskbarEdit());
    },
  },
};

export default defaultCommands;
