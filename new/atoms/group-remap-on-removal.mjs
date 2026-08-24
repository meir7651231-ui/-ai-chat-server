/** חוט · group-remap-on-removal — מיפוי-שיוכים בהסרת מפגש: תוויות "קבוצה N"
 *  פוזיציוניות זזות (N⇒N-1) אחרי המפגש שהוסר; label מפורש לא זז.
 *  חוזה: group-remap-on-removal.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:159-173; השכן groupLabelOf
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function groupRemapOnRemoval(sessions, removeIdx, groupLabelOf) {
  const removed = groupLabelOf(sessions[removeIdx], removeIdx);
  const remap = new Map();
  for (let k = removeIdx + 1; k < sessions.length; k++) {
    const oldLabel = groupLabelOf(sessions[k], k);
    const newLabel = groupLabelOf(sessions[k], k - 1);
    if (oldLabel !== newLabel) remap.set(oldLabel, newLabel);
  }
  return { removed, remap };
}
