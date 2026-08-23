/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supKeyMapOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:52-60 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supKeyMapOf, supKeyOf, where
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supKeyMapOf(supporters) {
    return new Map(supporters.map((sp) => [sp.id, supKeyOf(sp)]));
}
/**
 * ערכי שאילתת-ה-`where('skey','in',…)` לעובד/ת מוגבל/ת: הייעודים המותרים (מנוקים)
 * + המפתח-המשותף. Firestore מגביל `in` ל-30 ערכים ⇒ 29 ייעודים + המשותף. ריקים
 * מסוננים (לא ערך-מפתח חוקי). דטרמיניסטי (סדר-הקלט נשמר) — נוח לבדיקה.
 */
