/** 🪨 טיוטת-חוט (דרגת-מחצבה) · reenrollListText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:338-344 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): reenrollListText, decWord
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function reenrollListText(rows) {
    const decWord = (d) => (d === 'yes' ? 'ממשיך' : d === 'no' ? 'לא ממשיך' : d === 'hold' ? 'בהמתנה' : 'טרם הוחלט');
    return rows
        .map((r) => `${r.memberName} · ${r.courseName} — נוכחות ${r.summary.presents}, חיסורים ${r.summary.absences} · ${decWord(r.decision)}${r.renewed ? ' ✓נרשם' : ''}`)
        .join('\n');
}
