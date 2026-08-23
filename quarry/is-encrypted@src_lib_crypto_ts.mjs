/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isEncrypted — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:101-105 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isEncrypted
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isEncrypted(raw) {
    return !!raw && typeof raw === 'object' && raw.$enc === 2;
}
/** חילוץ ה-DEK מהמעטפת בעזרת סיסמה או מפתח שחזור. null = סוד שגוי. */
