/** חוט · item-label — שם פריט-בודד-למעקב במודול-העין, מותאם-ארגון.
 *  חוזה: item-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:40-42 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function itemLabel(cfg, termOf, T) {
    return termOf(cfg, T.k1, T.k2);
}
