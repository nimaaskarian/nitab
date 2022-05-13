export default function eventKeyNumber(ev) {
  const keyNumberString = ev.code.replace("Numpad", "").replace("Digit", "");

  return keyNumberString === "0" ? 10 : +keyNumberString;
}
