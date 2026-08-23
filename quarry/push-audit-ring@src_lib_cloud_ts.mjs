/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pushAuditRing — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:149-157 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pushAuditRing, requireDb, encryptDoc, setDoc, scopedCol
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pushAuditRing(entries, dek) {
    if (!auditUid)
        return;
    const db = requireDb();
    const ring = entries.slice(-AUDIT_CAP);
    const body = dek ? await encryptDoc({ entries: ring }, dek) : { entries: ring };
    await setDoc(doc(db, scopedCol('auditlog'), auditUid), body);
}
/** משיכת כל טבעות-הלוג וממוזגות (מנהל/מייל-על בלבד) — עובד/ת ⇒ null (בלי גישה). */
