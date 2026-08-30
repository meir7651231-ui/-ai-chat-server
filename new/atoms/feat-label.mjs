/** חוט · feat-label — שם פיצ'ר-העין מותאם-ארגון (כותרת הלוח/הכרטיס).
 *  חוזה: feat-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:35-37 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function featLabel(cfg, termOf, T) {
    return termOf(cfg, T.k1, T.k2);
}
