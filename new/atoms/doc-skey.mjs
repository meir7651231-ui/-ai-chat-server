/** חוט · doc-skey — מפתח-skey של מסמך באוסף נאכף-הרשאה. חוזה: doc-skey.contract.md
 *  חולץ כלשונו מ-maor/src/lib/supporterPartition.ts:42-51; השכן supKeyOf
 *  והקבוע SHARED_SUP_KEY הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function docSkey(col, data, supKeyBySpId, supKeyOf, sharedSupKey, T) {
  if (col === T.k1) return supKeyOf(data);
  if (col === T.k2) {
    const spId = typeof data.spId === T.k3 ? data.spId : '';
    return spId ? (supKeyBySpId.get(spId) ?? sharedSupKey) : sharedSupKey;
  }
  return '';
}
