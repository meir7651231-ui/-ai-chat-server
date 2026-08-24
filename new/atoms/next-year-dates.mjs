/** חוט · next-year-dates — הזזת תאריכי-חוג (start/end) שנה קדימה, שומר יום/חודש.
 *  חוזה: next-year-dates.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:35-46; השכנים
 *  atNoon (פרסור-צהריים) ו-toIso (החזרה ל-ISO) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function nextYearDates(start, end, atNoon, toIso) {
  const shift = (iso) => {
    const d = atNoon(iso);
    d.setFullYear(d.getFullYear() + 1);
    return toIso(d);
  };
  return { start: shift(start), end: shift(end) };
}
