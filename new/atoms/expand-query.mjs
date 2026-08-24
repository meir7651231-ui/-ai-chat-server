/** 🔌 חוט · expand-query — הרחבת-שאילתה דרך מילון-התעתיקים: מפתח-עברי ⇒ +כינויים,
 *  כינוי ⇒ +המפתח-העברי; תמיד כולל את השאילתה עצמה, בלי כפולים.
 *  מוצא: maor/src/lib/search.ts:129-138 כלשונו; ‏normSearch ו-XLAT הוזרקו כשקעים (חוק-1). */
/** @param q השאילתה · @param normSearch שקע: (s)=>string · @param XLAT שקע: Record<string,string[]> */
export function expandQuery(q, normSearch, XLAT) {
  const nq = normSearch(q);
  const out = [q];
  if (!nq) return out;
  for (const [heb, aliases] of Object.entries(XLAT)) {
    if (normSearch(heb) === nq) out.push(...aliases);
    else if (aliases.some((a) => normSearch(a) === nq)) out.push(heb);
  }
  return [...new Set(out)];
}
