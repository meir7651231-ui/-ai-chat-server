/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isSuperAdmin — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:730-738 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isSuperAdmin
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isSuperAdmin(email) {
    const e = (email || '').trim().toLowerCase();
    return !!e && SUPER_ADMIN_EMAILS.includes(e);
}
/**
 * ולידציית טופס ההרשמה (ענן 3) — טהורה עד גבול ה-SDK: מחזירה הודעת שגיאה
 * בעברית או '' כשהקלט תקין.
 */
