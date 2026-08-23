/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ORBIT_BLUE — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/orbitTheme.ts:17-92 (76 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): rgba, hexToRgb, parseInt, rgbToHsl, hslToRgb, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const ORBIT_BLUE = {
    vars: {
        '--o-g1': '#1a2340',
        '--o-g2': '#0d1120',
        '--o-g3': '#070a12',
        '--o-a1': 'rgba(110,168,254,0.30)',
        '--o-a2': 'rgba(140,150,255,0.20)',
        '--o-a3': 'rgba(120,200,255,0.15)',
        '--o-a4': 'rgba(110,168,254,0.12)',
        '--o-accent': '#6ea8fe',
        '--o-accent-rgb': '110,168,254',
        '--o-accent2': '#8fa8ff',
        '--o-glow': 'rgba(120,150,255,0.30)',
        '--o-btn-a': '#7d9bff',
        '--o-btn-b': '#5570ff',
        '--o-btn-text': '#ffffff',
        '--accent': '#6ea8fe',
    },
    scene: 'Aurora',
};
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
        if (max === r)
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g)
            h = ((b - r) / d + 2) / 6;
        else
            h = ((r - g) / d + 4) / 6;
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
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    return { r: Math.round(hue(h + 1 / 3) * 255), g: Math.round(hue(h) * 255), b: Math.round(hue(h - 1 / 3) * 255) };
}
const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
const rgbStr = (c) => `${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)}`;
/** בהירות נתפסת (0..1) — לבחירת צבע-טקסט מנוגד על הכפתור. */
const luminance = (c) => (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
/**
 * מחזיר ערכת-מסך לפי accent. חסר/לא-תקין ⇒ אורביט (כחול). accent תקין ⇒ ערכה
 * נגזרת: קרקע כהה בגוון-האקסנט, אַאוּרוֹרה סביב הגוון, כפתור וזוהר באקסנט, וסצנת-
 * כדור לפי הגוון (חם⇒Ember · קריר⇒Aurora · בהיר-מאוד⇒Ice).
 */
