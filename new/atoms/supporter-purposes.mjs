/** חוט · supporter-purposes — קבוצת-הייעודים שעל תורם (distinct, בלי ריקים):
 *  איחוד forWho (פר-תורם) + donations[].purpose (פר-תרומה).
 *  חוזה: supporter-purposes.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:36-45. */
export function supporterPurposes(sup) {
  const set = new Set();
  const fw = (sup.forWho ?? '').trim();
  if (fw) set.add(fw);
  for (const d of sup.donations ?? []) {
    const p = (d.purpose ?? '').trim();
    if (p) set.add(p);
  }
  return [...set];
}
