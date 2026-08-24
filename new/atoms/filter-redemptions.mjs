/** חוט · filter-redemptions — סינון מימושי-שיוך: טווח כוללני + החרגת מבוטלים.
 *  חוזה: filter-redemptions.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:565-575 (תורגם TS→JS);
 *  השכן dateInRange הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function filterRedemptions(a, fromIso, toIso, includeVoided, dateInRange) {
    return a.redemptions.filter((r) => dateInRange(r.date, fromIso, toIso) && (includeVoided || !r.voidedAt));
}
