/** חוט · doc-skey — מפתח-skey של מסמך באוסף נאכף-הרשאה. חוזה: doc-skey.contract.md
 *  חולץ כלשונו מ-maor/src/lib/supporterPartition.ts:42-51; השכן supKeyOf
 *  והקבוע SHARED_SUP_KEY הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function docSkey(col, data, supKeyBySpId, supKeyOf, sharedSupKey) {
  if (col === 'supporters') return supKeyOf(data);
  if (col === 'events') {
    const spId = typeof data.spId === 'string' ? data.spId : '';
    return spId ? (supKeyBySpId.get(spId) ?? sharedSupKey) : sharedSupKey;
  }
  return '';
}
