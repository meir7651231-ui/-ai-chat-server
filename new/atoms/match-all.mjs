/** חוט · match-all — שיוך-מרובה של תשלומים-נכנסים לחיובים-מתוכננים.
 *  חוזה: match-all.contract.md
 *  חולץ כלשונו מ-maor/src/lib/plannedMatch.ts:130-144 (matchAll); השכן
 *  matchIncomingToPlanned (שיוך-יחיד) הוזרק כשקע (חוק-1 — אפס import פנימי).
 *  פלן שכבר-שויך בסבב מוצא מהמאגר לתשלום-הבא (מונע תפיסה-כפולה בבאלק). */
export function matchAll(incomings, allOpen, matchIncomingToPlanned) {
  const out = [];
  const used = new Set(); // planId שכבר-שויך בסבב-הזה
  const pool = [...allOpen];
  for (const inc of incomings) {
    const stillOpen = pool.filter((r) => !used.has(r.plan.id));
    const m = matchIncomingToPlanned(inc, stillOpen);
    if (m) {
      out.push(m);
      used.add(m.plan.id);
    }
  }
  return out;
}
