/** אטום-קבוע · coral-palette — קודם אוטומטית (צילום-ערך). חוזה: coral-palette.contract.md */
export const CORAL_PALETTE = {
    c1: '#EC9C9C', c2: '#D97F7F', c3: '#B95F5F', word: '#E29392', ink: '#33272A',
    paper: '#FFFCFA', cream: '#FBF1EF', blush: '#FFF3F0', marquee: '#F9E4E1',
    rgb1: '236,156,156', rgb2: '217,127,127', inkRgb: '51,39,42',
};
function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
    if (!m)
        return null;
    let h = m[1];
    if (h.length === 3)
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (d) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r)
            h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g)
            h = (b - r) / d + 2;
        else
            h = (r - g) / d + 4;
        h *= 60;
    }
    return [h, s, l];
}
function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60)
        [r, g, b] = [c, x, 0];
    else if (h < 120)
        [r, g, b] = [x, c, 0];
    else if (h < 180)
        [r, g, b] = [0, c, x];
    else if (h < 240)
        [r, g, b] = [0, x, c];
    else if (h < 300)
        [r, g, b] = [x, 0, c];
    else
        [r, g, b] = [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
function toHex([r, g, b]) {
    return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}
const rgbStr = ([r, g, b]) => `${r},${g},${b}`;
/**
 * גוזר משפחת-פלטה מלאה מצבע-הדגשה. אין accent/לא-תקין ⇒ CORAL_PALETTE (ביט-זהה).
 * הגוון (hue) נשמר; מכווננים רוויה+בהירות ליצירת בהיר/בינוני/עמוק + קרקעות
 * בהירות-גוון + דיו-כהה-מגוון. כך כל ורטיקל מקבל זהות-צבע קוהרנטית באותו עיצוב.
 */
