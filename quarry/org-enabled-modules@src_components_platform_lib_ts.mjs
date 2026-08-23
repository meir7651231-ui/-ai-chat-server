/** 🪨 טיוטת-חוט (דרגת-מחצבה) · orgEnabledModules — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:135-144 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): orgEnabledModules
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function orgEnabledModules(orgConfig) {
    return ALL_MODULES.filter((m) => orgConfig.modules?.[m] !== false);
}
/**
 * טווח **תת-הדגלים** שהמנהל יכול לחלק לעובדות = דגלים ש**דלוקים בארגון**
 * (לא-false) ושהמודול-האב שלהם (אם הוא מודול-אמיתי) דלוק. דגל שהבעלים כיבה
 * לארגון, או שנמצא תחת מודול כבוי — לא מופיע למנהל (עקרון התקרה, גם ברזולוציית-דגל).
 * טהור; מקבל את מרשם ה-FEATURES מבחוץ (בלי תלות מעגלית).
 */
