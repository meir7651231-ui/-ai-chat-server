/** 🪨 טיוטת-חוט (דרגת-מחצבה) · signUpError — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:739-761 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): signUpError
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function signUpError(orgName, contactName, phone, email, password, password2) {
    if (!orgName.trim())
        return 'שם הארגון הוא שדה חובה';
    // הזרימה מבוססת שיחה חוזרת (עדכון פקודה 30.7) — איש קשר וטלפון חובה
    if (!contactName.trim())
        return 'שם איש הקשר הוא שדה חובה';
    if (!/^[\d+][\d\s-]{6,}$/.test(phone.trim()))
        return 'מספר טלפון תקין הוא שדה חובה — נחזור אליכם לאישור';
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
        return 'כתובת האימייל אינה תקינה';
    if (password.length < 6)
        return 'הסיסמה חייבת להיות לפחות 6 תווים';
    if (password !== password2)
        return 'הסיסמאות אינן זהות';
    return '';
}
/**
 * ולידציית הרשמת-עובד/ת (ORGADMIN — מסך-אחיד, "קוד מהבוס") — טהורה עד גבול
 * ה-SDK: מייל תקין, טלפון, סיסמה ≥6, וקוד-הזמנה לא-ריק. מחזירה הודעת שגיאה
 * בעברית או '' כשהקלט תקין. פירוק הקוד עצמו (slug.code) נבדק ב-parseJoinFullCode.
 */
