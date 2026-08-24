/** חוט · donation-partition-diff — diff מסמכי-תרומה בין שתי רשימות-תומכים. חוזה: donation-partition-diff.contract.md
 *  חולץ כלשונו מ-maor/src/lib/donationPartition.ts:103-120; השכן
 *  explodeSupporter הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function donationPartitionDiff(prev, next, explodeSupporter) {
  const index = (list) => {
    const m = new Map();
    for (const sp of list) for (const doc of explodeSupporter(sp)) m.set(doc.id, doc);
    return m;
  };
  const prevDocs = index(prev);
  const nextDocs = index(next);
  const sets = [];
  for (const [id, doc] of nextDocs) {
    const before = prevDocs.get(id);
    if (!before || JSON.stringify(before) !== JSON.stringify(doc)) sets.push(doc);
  }
  const deletes = [];
  for (const id of prevDocs.keys()) if (!nextDocs.has(id)) deletes.push(id);
  return { sets, deletes };
}
