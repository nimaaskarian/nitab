import localforage from "localforage";
import { nanoid } from "nanoid";
import store from "store";
import { addBackground } from "store/actions";

const addBlobAsBackground = (blob, meta, type = "id") => {
  const id = nanoid(10);
  const addBgObj = { [type]: id };

  localforage.setItem(id, blob);
  store.dispatch(addBackground(addBgObj, meta));
};

export default addBlobAsBackground;
