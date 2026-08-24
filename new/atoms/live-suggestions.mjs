/** חוט · live-suggestions — ההצעות החיות (בלי המסומנות "טופל" ב-attnDone).
 *  חוזה: live-suggestions.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop8/lib.ts:140-143; השכן suggestions
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function liveSuggestions(db, todayIso, config, suggestions) {
    const done = db.attnDone ?? {};
    return suggestions(db, todayIso, config).filter((s) => !done[s.key]);
}
