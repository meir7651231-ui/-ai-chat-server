/** 🪨 טיוטת-חוט (דרגת-מחצבה) · phoneIssue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/audit.ts:60-77 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): phoneIssue, digits
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function phoneIssue(p) {
    if (!p || p === '-')
        return null;
    const d = digits(p);
    if ((d.length === 9 || d.length === 10) && d[0] === '0')
        return null;
    if (d.length === 8)
        return 'כנראה חסרה ספרת 0 מובילה: ' + p;
    if (d.length < 7)
        return 'קצר מדי: ' + p;
    if (d[0] !== '0')
        return 'לא מתחיל ב-0: ' + p;
    return 'אורך חריג (' + d.length + ' ספרות): ' + p;
}
/**
 * הרצת הביקורת — מחזירה את כל הממצאים (לא ממוינים). הקיבוץ לקטגוריות
 * נעשה בתצוגה. הלוגיקה זהה לאב-הטיפוס עד לפרטי הניסוח.
 *
 * ביקורת מורחבת (P2 פער 22, feature settings.audit.extra): יעד-קשר שעבר
 * ותרומות בסכום אפס/שלילי. todayIso מוזרק (טוהר — בלי שעון פנימי);
 * ריק ⇒ בדיקת יעד-הקשר מדולגת. extra=false ⇒ שתי הבדיקות כבויות.
 */
