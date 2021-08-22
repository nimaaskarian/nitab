import localforage from "localforage";
import { store } from "../store";
import { setBackground as setBgAction } from "../actions";

export const setBackground = async (background) => {
  if (!background) {
    background = await localforage.getItem("background");
  } else {
    localforage.setItem("background", background);
  }
  if (background && background !== null)
    store.dispatch(
      setBgAction(
        typeof background === "object"
          ? `url('${URL.createObjectURL(background)}')`
          : background
      )
    );
};
