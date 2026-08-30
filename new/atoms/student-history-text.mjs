/** חוט · student-history-text — היסטוריית-תלמיד/ה כטקסט קריא (שורה להשתתפות).
 *  חוזה: student-history-text.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:306-318;
 *  אפס import פנימי (חוק-1). */
export function studentHistoryText(entries, T) {
  return entries
    .map((h) => {
      const yr = h.yearLabel ? `[${h.yearLabel}] ` : '';
      const grp = h.group ? ` · ${h.group}` : '';
      return `${yr}${h.courseName}${grp}${T.k1}${h.summary.presents}${T.k2}${h.summary.absences} · ${h.summary.statusLabel}`;
    })
    .join('\n');
}
