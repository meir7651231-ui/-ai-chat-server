/** 🪨 טיוטת-חוט (דרגת-מחצבה) · clampScale — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/a11y.ts:35-43 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): clampScale, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function clampScale(v) {
    if (!Number.isFinite(v))
        return 1;
    return Math.min(SCALE_MAX, Math.max(SCALE_MIN, v));
}
/**
 * צעד אחד למעלה/למטה — העיגול כמו בלגאסי (Math.round(v*10)/10, script:3193)
 * כדי שלא יצטברו שאריות float (‎1.1+0.1=1.2000000000000002‎).
 */
