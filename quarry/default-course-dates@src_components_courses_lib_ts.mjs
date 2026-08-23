/** 🪨 טיוטת-חוט (דרגת-מחצבה) · defaultCourseDates — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:32-46 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): defaultCourseDates, isoTodayLocal, isNaN, getTime, getFullYear, getMonth
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function defaultCourseDates(today = isoTodayLocal()) {
    const d = new Date(today.slice(0, 10) + 'T12:00:00');
    const y = isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
    const m = isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth(); // 0-based; 7 = אוגוסט
    // שנת-הלימודים פותחת ב-1.9. באוגוסט ואילך (m>=7) פותחים את השנה שמתחילה השנה;
    // בספטמבר–יולי אנחנו בתוך השנה שנפתחה בספטמבר הקודם.
    const startYear = m >= 7 ? y : y - 1;
    return { start: `${startYear}-09-01`, end: `${startYear + 1}-07-31` };
}
/**
 * מונה-נוכחות חודשי (#10, הכרעת בעלים "לאפס ולשמור בדוחות"): מספר תאריכי-הנוכחות
 * (presents) בחודש הקלנדרי של todayIso. מתאפס אוטומטית בכל חודש; ההיסטוריה המלאה
 * נשמרת ב-used (סה"כ) וברשומות presents (לדוחות). ניקובי-עבר בלי תאריך = 0 החודש.
 */
