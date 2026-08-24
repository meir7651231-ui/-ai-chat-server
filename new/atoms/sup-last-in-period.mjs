/** חוט · sup-last-in-period — האם התרומה-האחרונה נפלה בשנה/חודש (null=כל; בלי-תרומה=false).
 *  חוזה: sup-last-in-period.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:133-142;
 *  השכן supLast הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function supLastInPeriod(sp, year, month, supLast) {
  if (year == null && month == null) return true;
  const iso = supLast(sp);
  if (!iso) return false;
  if (year != null && +iso.slice(0, 4) !== year) return false;
  if (month != null && +iso.slice(5, 7) !== month) return false;
  return true;
}
