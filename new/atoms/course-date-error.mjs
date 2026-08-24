/** חוט · course-date-error — ולידציית טווח תאריכי-חוג. חוזה: course-date-error.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:57-65; השכן termOf
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function courseDateError(start, end, config, termOf) {
  if (start && end && end < start) {
    const courseWord = config ? termOf(config, 'entity.course', 'חוג') : 'חוג';
    return 'תאריך הסיום מוקדם מתאריך ההתחלה — ה' + courseWord + ' לא יופיע בלוח. תקנו את התאריכים';
  }
  return null;
}
