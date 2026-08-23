/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orbitTheme — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/orbitTheme.ts:93-132 (40 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orbitTheme, hexToRgb, rgbToHsl, toHex, rgbStr, hslToRgb, luminance, rgba
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orbitTheme(accent) {
    if (!accent || !HEX6.test(accent.trim()))
        return ORBIT_BLUE;
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
    const btnText = luminance(base) > 0.62 ? '#2a1710' : '#ffffff';
    const scene = l > 0.86 ? 'Ice' : h >= 15 && h <= 70 ? 'Ember' : h >= 180 && h <= 265 ? 'Aurora' : 'Aurora';
    return {
        vars: {
            '--o-g1': toHex(g1),
            '--o-g2': toHex(g2),
            '--o-g3': toHex(g3),
            '--o-a1': `rgba(${accentRgb},0.30)`,
            '--o-a2': `rgba(${auroraHi},0.20)`,
            '--o-a3': `rgba(${auroraLo},0.15)`,
            '--o-a4': `rgba(${accentRgb},0.12)`,
            '--o-accent': accentHex,
            '--o-accent-rgb': accentRgb,
            '--o-accent2': toHex(accent2),
            '--o-glow': `rgba(${accentRgb},0.30)`,
            '--o-btn-a': toHex(btnA),
            '--o-btn-b': accentHex,
            '--o-btn-text': btnText,
            '--accent': accentHex,
        },
        scene,
    };
}
