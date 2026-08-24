/** חוט · merge-donations-preserving — מיזוג-תרומות חסין-אובדן (איחוד לפי rid, מונים רק עולים).
 *  חוזה: merge-donations-preserving.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:51-71 (תורגם TS→JS). טהור, אפס שקעים. */
export function mergeDonationsPreserving(col, local, incoming) {
  if (col !== 'supporters')
    return incoming;
  const localDon = Array.isArray(local.donations) ? local.donations : [];
  const incDon = Array.isArray(incoming.donations) ? incoming.donations : [];
  const incRids = new Set(incDon.map((d) => d && d.rid).filter(Boolean));
  const localOnly = localDon.filter((d) => d && d.rid && !incRids.has(d.rid));
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const count = Math.max(num(incoming.count), num(local.count));
  const ils = Math.max(num(incoming.ils), num(local.ils));
  const usd = Math.max(num(incoming.usd), num(local.usd));
  // אם אין תרומה מקומית-בלבד והמונים לא גדלו — אין מה לשמר, הענן כמות-שהוא.
  if (localOnly.length === 0 && count === num(incoming.count) && ils === num(incoming.ils) && usd === num(incoming.usd)) {
    return incoming;
  }
  return { ...incoming, donations: [...incDon, ...localOnly], count, ils, usd };
}
