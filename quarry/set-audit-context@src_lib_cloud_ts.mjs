/** 🪨 טיוטת-חוט (דרגת-מחצבה) · setAuditContext — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:138-143 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): setAuditContext
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function setAuditContext(uid, email, canRead) {
    auditUid = uid;
    auditEmail = email.trim().toLowerCase();
    auditReadable = canRead;
}
/** המייל שכותב את הלוג (לסינון הטבעת-הנדחפת לפעולות-שלו-בלבד). */
