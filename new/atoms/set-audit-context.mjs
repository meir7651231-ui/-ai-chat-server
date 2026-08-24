/** חוט · set-audit-context — בניית הקשר-הלוג-המסונכרן של המחובר: uid + מייל מנורמל + הרשאת-קריאה.
 *  חוזה: set-audit-context.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:138-143; במקור הושם לשלושה משתני-מודול
 *  (auditUid/auditEmail/auditReadable) — ההשמה היא חיווט-קופסה (חוק-1/חוק-5 —
 *  האטום מחשב את ערך-ההקשר בלבד, לא מחזיק מצב). */
export function setAuditContext(uid, email, canRead) {
    return { auditUid: uid, auditEmail: email.trim().toLowerCase(), auditReadable: canRead };
}
