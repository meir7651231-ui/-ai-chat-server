/** חוט · find-all-open-plans — כל החיובים-המתוכננים הפתוחים ב-DB. חוזה: find-all-open-plans.contract.md
 *  חולץ כלשונו מ-maor/src/lib/plannedMatch.ts:71-106. אטום-טהור, אפס-שקעים. */
export function findAllOpenPlans(db, T) {
  const out = [];
  for (const sup of db.supporters) {
    for (const pl of sup.plannedCharges || []) {
      if (pl.chargedRid || pl.cancelledAt) continue;
      out.push({ entityType: T.k1, entityId: sup.id, plan: pl, name: sup.name });
    }
  }
  for (const en of db.enrollments) {
    if (!en.plannedCharges?.length) continue;
    // שם: חבר-במשפחה של השיבוץ (לצורך התאמה מול name בעסקה)
    const fam = db.families.find((f) => f.members.some((m) => m.id === en.memberId));
    const mem = fam?.members.find((m) => m.id === en.memberId);
    const nm = ((mem?.first || '') + ' ' + (fam?.name || '')).trim();
    for (const pl of en.plannedCharges) {
      if (pl.chargedRid || pl.cancelledAt) continue;
      out.push({ entityType: T.k2, entityId: en.id, plan: pl, name: nm });
    }
  }
  for (const a of db.shopAssignments) {
    if (!a.plannedCharges?.length) continue;
    const fam = db.families.find((f) => f.id === a.famId);
    const nm = fam?.name || '';
    for (const pl of a.plannedCharges) {
      if (pl.chargedRid || pl.cancelledAt) continue;
      out.push({ entityType: T.k3, entityId: a.id, plan: pl, name: nm });
    }
  }
  return out;
}
