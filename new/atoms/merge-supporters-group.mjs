/** חוט · merge-supporters-group — מיזוג-קבוצה אטומי: קיפול מיזוג-הזוגות מעל כל ה-losers.
 *  חוזה: merge-supporters-group.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:388-403; השכן mergeSupporterInto (מיזוג-
 *  זוג — האטום merge-supporter-into) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function mergeSupportersGroup(keeper, losers, mergeSupporterInto) {
    return losers.reduce((acc, l) => mergeSupporterInto(acc, l), keeper);
}
