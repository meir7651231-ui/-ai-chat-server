/** 🪨 טיוטת-חוט (דרגת-מחצבה) · HOK_CAT — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:679-693 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): monthsAgoIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const HOK_CAT = 'הו"ק';
/** חודשים-אזרחיים מאז תאריך-ISO עד היום (0 = אותו חודש). ריק ⇒ Infinity. */
function monthsAgoIso(iso, todayIso) {
    if (!iso)
        return Infinity;
    const [y, m] = iso.slice(0, 7).split('-').map(Number);
    const [ty, tm] = todayIso.slice(0, 7).split('-').map(Number);
    return (ty - y) * 12 + (tm - m);
}
/** האם ההו"ק **אפקטיבית-פעילה**. הו"ק ידני (בלי kevaId) ⇒ לפי הדגל בלבד. הו"ק
 *  מנוהלת-נדרים (kevaId) ⇒ נחשבת **פגה** אם אין חיוב-נדרים ב-hist מזה >2 חודשים —
 *  כי ביטול-הו"ק בנדרים לא שולח אירוע, פשוט מפסיקים להגיע חיובים (אחרת הכרטיס
 *  נשאר "פעיל" לנצח ומנפח את ההכנסה-הקבועה). **נגזרת** (בלי מוטציה) ⇒ מתאוששת
 *  מאליה אם החיובים חוזרים. סף = 2 חודשים (עקבי עם detectRecurringHok). (תיקון 20.8) */
