/** 🪨 טיוטת-חוט (דרגת-מחצבה) · STATUS_META — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:37-51 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): —
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export const STATUS_META = {
    active: { label: 'פעילה', bg: '#e4f5ea', c: '#12803c' },
    pending: { label: 'ממתינה', bg: '#fdf1d4', c: '#9a6414' },
    inactive: { label: 'לא פעילה', bg: '#eceae2', c: '#8b8474' },
};
/** סף מדד-אמינות "סיכון" — יישור ללגאסי (tierOf red). ratchet: legacy tier red <500. */
