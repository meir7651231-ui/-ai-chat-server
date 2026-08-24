/** חוט · run-net-check — הרצת כל בדיקות-הרשת במקביל, תוצאות בסדר-היעדים.
 *  חוזה: run-net-check.contract.md
 *  חולץ כלשונו מ-maor/src/lib/netcheck.ts:100-104; השכן checkOne (בדיקת
 *  יעד-יחיד, fetch+timeout) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function runNetCheck(targets, timeoutMs = 8000, checkOne) {
  return Promise.all(targets.map((t) => checkOne(t, timeoutMs)));
}
