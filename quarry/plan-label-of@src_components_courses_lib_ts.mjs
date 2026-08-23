/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planLabelOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:421-431 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planLabelOf, planWord, payBal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planLabelOf(e) {
    let s = e.plan === 'punch' ? 'כרטיסייה · ' + e.purchased : planWord(e.plan);
    if (e.status === 'paused')
        s += ' · מוקפא ⏸';
    else if (e.status === 'ended')
        s += ' · הסתיים';
    if (e.absences.length)
        s += ' · ' + e.absences.length + ' חיס׳';
    const bal = payBal(e);
    if (bal > 0)
        s += ' · 💳 ₪' + bal;
    return s;
}
/** צ'יפ קטן בסגנון אחיד. */
