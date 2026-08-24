/** חוט · fam-live-enrollments — השיבוצים ה"חיים" של משפחה (בלי ended/wait).
 *  חוזה: fam-live-enrollments.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:79-81 (תורגם TS→JS);
 *  השכן famEnrollments הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function famLiveEnrollments(db, fam, famEnrollments) {
    return famEnrollments(db, fam).filter((e) => e.status !== 'ended' && e.status !== 'wait');
}
