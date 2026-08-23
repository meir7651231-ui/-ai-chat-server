/** חוט · group-label-of — תווית קבוצה: label או "קבוצה N" פוזיציוני.
 *  חוזה: group-label-of.contract.md · חולץ כלשונו מ-maor/src/components/courses/lib.ts */
export function groupLabelOf(ss, i) {
  return ss.label || 'קבוצה ' + (i + 1);
}
