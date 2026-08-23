/** 🪨 טיוטת-חוט (דרגת-מחצבה) · reenrollCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:319-337 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): reenrollCsvRows, decWord
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function reenrollCsvRows(rows) {
    const head = ['תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה'];
    const decWord = (d) => (d === 'yes' ? 'ממשיך' : d === 'no' ? 'לא ממשיך' : d === 'hold' ? 'בהמתנה' : '');
    const body = rows.map((r) => [
        r.memberName,
        r.familyName,
        r.courseName,
        String(r.summary.presents),
        String(r.summary.absences),
        String(r.summary.balance),
        r.summary.statusLabel,
        decWord(r.decision),
        r.renewed ? 'כן' : '',
        r.e.renewNote ?? '',
    ]);
    return [head, ...body];
}
/** טקסט-תדפיס קריא (שורה לתלמיד/ה). */
