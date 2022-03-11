import localforage from "localforage";
import { nanoid } from "nanoid";
import store from "store";
import { setBackground as setBgAction } from "store/actions";

const setBackground = async (background) => {
  // const { backgroundId } = store.getState().data;
  if (!background) {
    // background = await localforage.getItem(backgroundId);
  } else {
    const id = nanoid(10);

    // localforage.setItem(id, background);
    // store.dispatch(setBackgroundId(id));
  }
  store.dispatch(
    setBgAction(
      typeof background === "object" && background
        ? `url('${URL.createObjectURL(background)}')`
        : background
    )
  );
};
export default setBackground;
