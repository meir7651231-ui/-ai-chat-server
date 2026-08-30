/** חוט · intel-day-diff — Golden. חוזה: intel-day-diff.contract.md
 * מוצא: maor-system/src/components/supporters/intel.ts:16 (dayDiff) + MS_DAY:13 (inline). חוק-4 verbatim.
 * הפרש-ימים בין ISO ליום (Date.parse על slice(0,10)+'T12:00:00'). Infinity לריק/לא-תקין.
 */
export function dayDiff(iso, todayIso, T) {
  const MS_DAY = T.k1;
  if (!iso) return Infinity;
  const a = Date.parse(iso.slice(0, T.k2) + 'T12:00:00');
  const b = Date.parse(todayIso.slice(0, T.k2) + 'T12:00:00');
  if (Number.isNaN(a) || Number.isNaN(b)) return Infinity;
  return Math.floor((b - a) / MS_DAY);
}
