import localforage from "localforage";
import { nanoid } from "nanoid";
import store from "store";
import { addBackground } from "store/actions";

const addBlobAsBackground = (blob) => {
  const id = nanoid(10);
  localforage.setItem(id, blob);
  store.dispatch(addBackground({ id }));
};

export default addBlobAsBackground;
