/** 🪨 טיוטת-חוט (דרגת-מחצבה) · roleOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:650-659 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): roleOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function roleOf(config, email) {
    const e = (email || '').trim().toLowerCase();
    if (!e)
        return 'staff';
    if (config.adminEmails?.some((a) => a.trim().toLowerCase() === e))
        return 'admin';
    const teachers = config.roles?.teachers;
    if (teachers && Object.keys(teachers).some((k) => k.trim().toLowerCase() === e))
        return 'teacher';
    return 'staff';
}
/** ה-teacherId הממופה למייל המורה — null כשאין מיפוי. */
