/** 🪨 טיוטת-חוט (דרגת-מחצבה) · purposeKeyOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/donationPartition.ts:24-33 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): purposeKeyOf, where
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function purposeKeyOf(d) {
    const p = (d.purpose ?? '').trim();
    return p || SHARED_PURPOSE_KEY;
}
/**
 * ערכי שאילתת-ה-`where('pkey','in',…)` לעובד/ת מוגבל/ת: הייעודים המותרים (מנוקים)
 * + המפתח-המשותף. Firestore מגביל `in` ל-30 ערכים ⇒ 29 ייעודים + המשותף. ריקים
 * וכפולים מסוננים. סימטרי ל-`supAllowedKeys` (אותו חיטוי לשני האוספים — נחיל 16.8).
 */
