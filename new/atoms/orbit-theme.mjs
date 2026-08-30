/** חוט · orbit-theme — גזירת ערכת-מסך (15 משתני-CSS + סצנת-כדור) מ-accent ארגוני.
 *  חוזה: orbit-theme.contract.md · שקעים: fallback (ערכת-הנפילה — החוט orbit-blue בקופסה).
 *  חולץ כלשונו מ-maor/src/lib/orbitTheme.ts (עוזרי-הצבע הפרטיים של הקובץ נשמרו
 *  בתוך החוט; ההפניה ל-ORBIT_BLUE השכן שוקעה לפרמטר fallback). */

/** בהירות נתפסת (0..1) — לבחירת צבע-טקסט מנוגד על הכפתור. */

export function orbitTheme(accent, fallback, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const HEX6 = /^#?[0-9a-fA-F]{6}$/;
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    const d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s, l };
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    s = Math.min(1, Math.max(0, s));
    l = Math.min(1, Math.max(0, l));
    if (s === 0) {
      const v = Math.round(l * 255);
      return { r: v, g: v, b: v };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return { r: Math.round(hue(h + 1 / 3) * 255), g: Math.round(hue(h) * 255), b: Math.round(hue(h - 1 / 3) * 255) };
  }
  const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  const rgbStr = (c) => `${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)}`;
  const luminance = (c) => (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;

  if (!accent || !HEX6.test(accent.trim())) return fallback;
  const base = hexToRgb(accent.trim());
  const { h, s, l } = rgbToHsl(base.r, base.g, base.b);
  const sat = Math.max(0.35, Math.min(0.95, s));
  const accentHex = toHex(base);
  const accentRgb = rgbStr(base);
  const accent2 = hslToRgb(h + 6, sat, Math.min(0.74, l + 0.1));
  // קרקע — כהה מאוד, גוון-האקסנט עם עומק (הסטה קלה לעבר מגנטה לחום/ורוד)
  const groundHueShift = h >= 15 && h <= 70 ? -12 : 0;
  const g1 = hslToRgb(h + groundHueShift, Math.min(0.5, sat * 0.6), 0.13);
  const g2 = hslToRgb(h + groundHueShift, Math.min(0.55, sat * 0.62), 0.075);
  const g3 = hslToRgb(h + groundHueShift, Math.min(0.5, sat * 0.6), 0.035);
  const auroraLo = rgbStr(hslToRgb(h - 18, sat, Math.min(0.66, l + 0.05)));
  const auroraHi = rgbStr(hslToRgb(h + 18, sat, Math.min(0.7, l + 0.08)));
  const btnA = hslToRgb(h, sat, Math.min(0.78, l + 0.12));
  const btnText = luminance(base) > 0.62 ? '#2a1710' : T.k1;
  const scene = l > 0.86 ? T.k2 : h >= 15 && h <= 70 ? T.k3 : h >= 180 && h <= 265 ? T.k4 : T.k4;
  return {
    vars: {
      '--o-g1': toHex(g1),
      '--o-g2': toHex(g2),
      '--o-g3': toHex(g3),
      '--o-a1': `${T.k5}${accentRgb},0.30)`,
      '--o-a2': `${T.k5}${auroraHi},0.20)`,
      '--o-a3': `${T.k5}${auroraLo},0.15)`,
      '--o-a4': `${T.k5}${accentRgb},0.12)`,
      '--o-accent': accentHex,
      '--o-accent-rgb': accentRgb,
      '--o-accent2': toHex(accent2),
      '--o-glow': `${T.k5}${accentRgb},0.30)`,
      '--o-btn-a': toHex(btnA),
      '--o-btn-b': accentHex,
      '--o-btn-text': btnText,
      '--accent': accentHex,
    },
    scene,
  };
}
