/** חוט · student-history-text — היסטוריית-תלמיד/ה כטקסט קריא (שורה להשתתפות).
 *  חוזה: student-history-text.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:306-318;
 *  אפס import פנימי (חוק-1). */
export function studentHistoryText(entries) {
  return entries
    .map((h) => {
      const yr = h.yearLabel ? `[${h.yearLabel}] ` : '';
      const grp = h.group ? ` · ${h.group}` : '';
      return `${yr}${h.courseName}${grp} — נוכחות ${h.summary.presents}, חיסורים ${h.summary.absences} · ${h.summary.statusLabel}`;
    })
    .join('\n');
}
