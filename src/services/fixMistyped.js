export function fixMistyped(string) {
  const persian = `ضصثقفغعهخحجچشسیبلاتنمکگظطزرذدپو./`;
  const english = `qwertyuiop[]asdfghjkl;'zxcvbnm,./`;
  const persianArray = persian.match(/.{1}/g);
  const englishArray = english.match(/.{1}/g);
  let output = "";
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    const charIndex = persianArray.findIndex((e) => e === c);
    if (englishArray[charIndex]) output += englishArray[charIndex];
    else output += c;
  }
  return output;
}
