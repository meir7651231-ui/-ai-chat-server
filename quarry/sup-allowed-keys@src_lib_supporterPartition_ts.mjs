/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supAllowedKeys — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supporterPartition.ts:61-69 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supAllowedKeys
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supAllowedKeys(allowed) {
    const clean = [...new Set(allowed.map((s) => s.trim()).filter(Boolean))].slice(0, 29);
    return [...clean, SHARED_SUP_KEY];
}
/**
 * הסרת שדה-המפתח `skey` מגוף-מסמך-הענן שנמשך — הוא plaintext מחוץ למעטפה ואינו
 * שדה של התומך המקומי. מחזיר עותק בלי `skey` (שאר השדות ביט-זהים).
 */
