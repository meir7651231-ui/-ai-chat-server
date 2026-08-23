/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chipStyle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:212-229 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): chipStyle
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function chipStyle(bg, c) {
    return {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color: c,
        whiteSpace: 'nowrap',
    };
}
/**
 * עיצוב טלפון ישראלי — מאוחד עם formatIsraeliPhone כדי שאותו מספר יעוצב זהה
 * בכל הטפסים (תומכים/משפחות/מורים). קודם היה מימוש נפרד שלא טיפל בקידומת 972
 * ולא הוסיף מקף למספר שכבר מתחיל ב-0 — פער חוצה-מערכת.
 */
