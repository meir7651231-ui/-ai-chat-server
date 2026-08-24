/** חוט · is-renewed — האם שיבוץ כבר נרשם לשנה הבאה (יש renewedToId).
 *  חוזה: is-renewed.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:52-54. */
export function isRenewed(e) {
  return !!e.renewedToId;
}
