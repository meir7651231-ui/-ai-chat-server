/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sitePalette — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:121-152 (32 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sitePalette, hexToRgb, rgbToHsl, hslToRgb, toHex, rgbStr
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sitePalette(accent) {
    const base = accent && accent.trim() ? hexToRgb(accent) : null;
    if (!base)
        return CORAL_PALETTE;
    const [h, s0] = rgbToHsl(base[0], base[1], base[2]);
    const s = Math.max(0.42, Math.min(0.86, s0));
    const mk = (sat, l) => hslToRgb(h, sat, l);
    const c1 = mk(Math.min(0.8, s * 0.92), 0.75);
    const c2 = mk(s, 0.62);
    const c3 = mk(Math.min(0.9, s * 1.04), 0.47);
    const word = mk(s, 0.67);
    const ink = mk(0.18, 0.16);
    return {
        c1: toHex(c1), c2: toHex(c2), c3: toHex(c3), word: toHex(word), ink: toHex(ink),
        paper: toHex(mk(0.4, 0.986)), cream: toHex(mk(0.46, 0.955)), blush: toHex(mk(0.62, 0.965)),
        marquee: toHex(mk(0.5, 0.9)),
        rgb1: rgbStr(c1), rgb2: rgbStr(c2), inkRgb: rgbStr(ink),
    };
}
