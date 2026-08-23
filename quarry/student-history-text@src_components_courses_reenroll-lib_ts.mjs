/** 🪨 טיוטת-חוט (דרגת-מחצבה) · studentHistoryText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:306-318 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): studentHistoryText
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function studentHistoryText(entries) {
    return entries
        .map((h) => {
        const yr = h.yearLabel ? `[${h.yearLabel}] ` : '';
        const grp = h.group ? ` · ${h.group}` : '';
        return `${yr}${h.courseName}${grp} — נוכחות ${h.summary.presents}, חיסורים ${h.summary.absences} · ${h.summary.statusLabel}`;
    })
        .join('\n');
}
// ---------- ייצוא (דרך שער core.export ב-UI) ----------
/** שורות CSV לרשימת-הרישום (כותרת + נתונים). */
