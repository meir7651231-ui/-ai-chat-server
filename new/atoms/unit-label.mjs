/** חוט · unit-label — שם מונה-הפריט במודול-העין, מותאם-ארגון.
 *  חוזה: unit-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:45-47 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function unitLabel(cfg, termOf, T) {
    return termOf(cfg, T.k1, T.k2);
}
