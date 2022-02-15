const isDark = function (a) {
  if (!a) return;
  a = a.trim().toLowerCase();
  var b = a.length,
    f = a[0],
    c = [],
    d = /[\d.*]+/g;
  if (/(^#?[a-f\d]+$)|\d/.test(a)) {
    if ("h" == f) {
      for (; (b = d.exec(a)); ) c.push(b[0]);
      var b = c[1] / 100,
        d = c[2] / 100,
        g = 0.5 > d ? d * (1 + b) : d + b - d * b,
        e = 2 * d - g,
        c = c[0] / 100;
      a = [c + 1 / 3, c, c - 1 / 3].map(function (a, b) {
        return (
          (255 *
            (((b = g - e), (a += 0 > a ? 1 : 1 < a ? -1 : 0)) < 1 / 6
              ? e + 6 * b * a
              : 0.5 > a
              ? g
              : a < 2 / 3
              ? e + b * (2 / 3 - a) * 6
              : e) +
            0.5) |
          0
        );
      });
    } else if ("r" == f) {
      for (; (b = d.exec(a.replace(/%/g, "*2.55"))); ) c.push(b[0]);
      a = c.map(eval);
    } else {
      let z;
      a = [
        ((z = "0x" + /\w{6}/.exec(a.replace(6 > b && /./g, "$&$&"))) >> 16) &
          255,
        (z >> 8) & 255,
        z & 255,
      ];
    }

    return 128e3 > 299 * a[0] + 587 * a[1] + 114 * a[2];
  }
  return !(
    "bIb=b*bRcLcRdYdad{dcdRdgdHd*dndKdofifGf(gSi{iimum>mom;m\\mnnmoMoWo{p,r.r?rUscs#s8sUsWs{t*th".indexOf(
      f + String.fromCharCode(((a.charCodeAt(628 % b) * b) % 91) + 33)
    ) % 2
  );
};
export default isDark;
