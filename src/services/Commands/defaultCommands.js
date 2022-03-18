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
} from "store/actions";
import { unsplash } from "apis";
import axios from "axios";
import { addBlobAsBackground } from "services/Images";

const defaultCommands = {
  date: {
    function() {
      return () => () => {
        store.dispatch(actions.toggleDateEnabled());
      };
    },
  },
  w: {
    function() {
      return () => () => {
        store.dispatch(actions.toggleWeatherEnabled());
        store.dispatch(actions.setTerm(""));
      };
    },
  },
  clock: {
    function(input) {
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
  },
  font: {
    function(input) {
      return () => () => store.dispatch(actions.setFont(input));
    },
  },
  todo: {
    function(input) {
      return () => () => store.dispatch(actions.addTodo({ message: input }));
    },
  },
  par: {
    function(input) {
      const index = store.getState().data.theme.currentBackground;
      if (!parseFloat(input))
        return () => () => store.dispatch(actions.toggleParallaxEnabled(index));
      return () => () =>
        store.dispatch(actions.setParallaxFactor(index, parseFloat(input)));
    },
  },
  c: {
    function(input) {
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
  },
  iden: {
    function(input) {
      return () => () => store.dispatch(actions.setIndentifier(input.trim()));
    },
  },
  exp: {
    function() {
      return () => () => store.dispatch(actions.exportData());
    },
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
  },
  mag: {
    function() {
      return () => () => store.dispatch(actions.toggleTaskbarMagnify());
    },
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
      const index = store.getState().data.theme.currentBackground;
      return () => () =>
        store.dispatch(
          actions.setBlur(index, {
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

      const index = store.getState().data.theme.currentBackground;

      return () => () =>
        store.dispatch(
          actions.setBrightness(index, {
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
        const collections = store.getState().data.theme.unsplashCollections;
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
      if (["command", "commandCl"].includes(commandName)) return;
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
      text = encodeURIComponent(text);
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
  tr: {
    function(input) {
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
    icon: "fa fa-language",
  },
  taskbar: {
    function() {
      return () => () => store.dispatch(actions.toggleTaskbarEdit());
    },
  },
};

export default defaultCommands;
