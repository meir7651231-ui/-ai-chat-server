/** חוט · name-matches — האם שני שמות "אותו-אדם". חוזה: name-matches.contract.md
 *  חולץ כלשונו מ-maor/src/lib/plannedMatch.ts:54-70 (nameMatches); השכן normName
 *  (נרמול-שם) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function nameMatches(a, b, normName) {
  const na = normName(a);
  const nb = normName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const wa = new Set(na.split(' ').filter((w) => w.length >= 2));
  const wb = new Set(nb.split(' ').filter((w) => w.length >= 2));
  if (wa.size === 0 || wb.size === 0) return false;
  let overlap = 0;
  for (const w of wa) if (wb.has(w)) overlap++;
  // דורש 2-חופפות (שם-פרטי+משפחה); רק כשלשני-הצדדים שם-יחיד ⇒ די באחת (תואם-מלא)
  const need = wa.size === 1 && wb.size === 1 ? 1 : 2;
  return overlap >= need;
}
