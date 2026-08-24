/** חוט · iso-local — ‏Date ⇒ ‏YYYY-MM-DD מקומי (בלי הזחת-UTC). חוזה: iso-local.contract.md
 *  חולץ כלשונו מ-maor/src/lib/date-util.ts:13-17. טהור — אפס שקעים. */
export function isoLocal(d) {
  const p2 = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
