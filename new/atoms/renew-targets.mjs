/** חוט · renew-targets — מי מיועד לרישום-המוני לשנה הבאה: "ממשיך" שעדיין לא נרשם.
 *  חוזה: renew-targets.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:198-206 (אפס שכנים). */
export function renewTargets(rows, T) {
  return rows.filter((r) => r.decision === T.k1 && !r.renewed);
}
