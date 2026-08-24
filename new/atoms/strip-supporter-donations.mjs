/** חוט · strip-supporter-donations — ריקון donations ממסמכי-תומך ב-diff
 *  (מסלול-B: התרומות באוסף-נפרד). טהור, אפס מוטציה.
 *  חוזה: strip-supporter-donations.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:75-83; אפס import פנימי (חוק-1). */
export function stripSupporterDonations(diff) {
  return {
    ...diff,
    sets: diff.sets.map((s) =>
      s.col === 'supporters' && s.data && typeof s.data === 'object'
        ? { ...s, data: { ...s.data, donations: [] } }
        : s),
  };
}
