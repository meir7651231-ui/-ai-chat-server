/** חוט · finder-matches — סינון-משפחות לפי נעילות-הגלגל (AND). חוזה: finder-matches.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:119-128; השכן
 *  finderAxisValue הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function finderMatches(db, locks, finderAxisValue) {
  return db.families.filter((f) =>
    Object.entries(locks).every(([k, v]) => finderAxisValue(db, f, k) === v),
  );
}
