/** חוט · hok-effectively-active — האם הו"ק אפקטיבית-פעילה. חוזה: hok-effectively-active.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:694-707; העוזר-הפרטי
 *  monthsAgoIso (שם:687-692) הוטמע כלשונו — לא שקע. */

/** חודשים-אזרחיים מאז תאריך-ISO עד היום (0 = אותו חודש). ריק ⇒ Infinity. */
function monthsAgoIso(iso, todayIso) {
  if (!iso) return Infinity;
  const [y, m] = iso.slice(0, 7).split('-').map(Number);
  const [ty, tm] = todayIso.slice(0, 7).split('-').map(Number);
  return (ty - y) * 12 + (tm - m);
}

export function hokEffectivelyActive(sp, todayIso) {
  const h = sp.hok;
  if (!h || !h.active) return false;
  if (!h.kevaId) return true; // הו"ק ידני — אין לאפ-אוטומטי
  let last = '';
  // 🐛 נחיל-סולה C7: גם חיובי-סולה נחשבים "חיות" של הו"ק-סליקה
  for (const e of sp.hist ?? []) if ((e.clearer === 'נדרים' || e.clearer === 'סולה') && (e.d || '') > last) last = e.d || '';
  if (!last) return true; // עדיין אין היסטוריית-נדרים — סומכים על הדגל
  return monthsAgoIso(last, todayIso) <= 2;
}
