/** 🪨 טיוטת-חוט (דרגת-מחצבה) · setAllowedPurposes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:112-121 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): setAllowedPurposes, supEnforceOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function setAllowedPurposes(p) {
    allowedPurposes = p && p.length ? p : null;
}
/* ── אכיפת-תומכים בשכבת-הנתונים (פאזה-2, dormant): כשדלוק — כל מסמך-תומך נדחף עם
   `skey` plaintext (=forWho), ועובד/ת מוגבל/ת מושך/ת בשאילתת `where skey in […]`
   (Rules דוחים list לא-מסונן). off-by-default ⇒ אף קוד לא מדליק עד פאזת-ההפעלה
   ⇒ ביט-זהה להיום (בלי skey, בלי סינון). ─────────────────────────────────── */
let supEnforceOn = false;
/** נקבע מ-connectCloud/applyCloudDoc לפי supEnforceOn(config) — עדיין לא מחווט (פאזה-5). */
