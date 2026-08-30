/** חוט · advance-status — הסטטוס הבא במסירת-חלוקה (קדימה בלבד). חוזה: advance-status.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:12-18 (כולל הקבוע ORDER,
 *  שהיה פרטי לאותו קובץ — אפס import פנימי). */
export function advanceStatus(status, ORDER, T) {
  const i = ORDER.indexOf(status);
  return i < 0 || i >= ORDER.length - 1 ? T.k1 : ORDER[i + 1];
}
