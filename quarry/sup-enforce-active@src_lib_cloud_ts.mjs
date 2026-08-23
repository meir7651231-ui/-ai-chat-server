/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supEnforceActive — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:126-137 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supEnforceActive
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supEnforceActive() {
    return supEnforceOn;
}
/* ── לוג-מנהל מסונכרן (משטח #3, "מנהל מסונכרן"): הלוג לא רוכב על meta המשותף
   אלא על `auditlog/{uid}` — כל משתמש כותב **רק** את מסמכו (טבעת-פעולותיו); מנהל/
   מייל-על קורא את **כל** המסמכים וממזג ⇒ רואה הכל. עובד/ת לא רשאי/ת לקרוא (Rules)
   ⇒ לא לומד/ת על פעולות של אחרת. dormant: פעיל רק כשאכיפה דלוקה. ─────────── */
let auditUid = '';
let auditEmail = '';
let auditReadable = false;
/** נקבע מהחיבור: uid+email של המחובר, ו-canRead=מנהל/מייל-על (קורא את כל הלוגים). */
