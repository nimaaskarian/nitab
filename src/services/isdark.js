function isDark(color) {
  if (!color || typeof color !== "string") return;
  const div = document.createElement("div");
  div.style.display = "none";
  div.style.color = color;
  document.body.appendChild(div);
  color = window.getComputedStyle(div).color || color;
  document.body.removeChild(div);
  //Color in RGB
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?

  // If RGB --> store the red, green, blue values in separate variables
  color = color.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
  );

  r = color[1];
  g = color[2];
  b = color[3];

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return false;
  }
  return true;
}
export default isDark;
