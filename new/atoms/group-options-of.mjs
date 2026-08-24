/** חוט · group-options-of — אפשרויות שיוך-קבוצה (רק כשיש יותר ממפגש אחד).
 *  חוזה: group-options-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:173-181; השכנים
 *  sessionsOf+groupLabelOf והקבוע DAY_NAMES הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function groupOptionsOf(c, sessionsOf, groupLabelOf, dayNames) {
    const ss = sessionsOf(c);
    if (ss.length <= 1)
        return [];
    return ss.map((s, i) => {
        const v = groupLabelOf(s, i);
        return { v, t: `${v} · יום ${dayNames[s.day]} ${s.time || ''}`.trim() };
    });
}
