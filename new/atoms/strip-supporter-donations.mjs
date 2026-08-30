/** חוט · strip-supporter-donations — ריקון donations ממסמכי-תומך ב-diff
 *  (מסלול-B: התרומות באוסף-נפרד). טהור, אפס מוטציה.
 *  חוזה: strip-supporter-donations.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:75-83; אפס import פנימי (חוק-1). */
export function stripSupporterDonations(diff, T) {
  return {
    ...diff,
    sets: diff.sets.map((s) =>
      s.col === T.k1 && s.data && typeof s.data === T.k2
        ? { ...s, data: { ...s.data, donations: [] } }
        : s),
  };
}
