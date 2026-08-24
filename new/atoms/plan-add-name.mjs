/** חוט · plan-add-name — תכנון הוספת-פריט לתיק-מעקב (dedup + אולי log).
 *  חוזה: plan-add-name.contract.md · שקעים: normName, isoToday
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts (קריאות-השכן שוקעו). */
export function planAddName(a, rawName, eyes, id, normName, isoToday) {
  const nm = rawName.trim();
  if (!nm) return { ok: false, error: 'הקלידו שם לפני ההוספה' };
  const key = normName(nm);
  if (a.names.some((x) => normName(x.name) === key)) {
    return { ok: false, error: `השם "${nm}" כבר ברשימה` };
  }
  const names = [...a.names, { id, name: nm, eyes, done: false }];
  if (eyes !== '' && eyes != null) {
    return { ok: true, names, log: [{ date: isoToday(), eyes: +eyes, name: nm }, ...a.log] };
  }
  return { ok: true, names };
}
