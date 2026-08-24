/** חוט · name-index — אינדקס בני-משפחה לפי מזהה (Map id⇒member) לדוחות.
 *  חוזה: name-index.contract.md · שקעים: allMembers.
 *  חולץ כלשונו מ-maor/src/components/reports/lib.ts:70-75; השכן allMembers
 *  (useApp) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function nameIndex(db, allMembers) {
  const map = new Map();
  for (const m of allMembers(db)) map.set(m.id, m);
  return map;
}
