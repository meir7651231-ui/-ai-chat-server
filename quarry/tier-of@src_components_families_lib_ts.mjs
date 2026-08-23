/** 🪨 טיוטת-חוט (דרגת-מחצבה) · tierOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:61-68 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): tierOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function tierOf(score) {
    if (score >= 950)
        return { key: 'titan', label: 'טיטאן', bg: '#fdf3dd', c: '#9a6414', dot: '#f3c76b' };
    if (score >= 800)
        return { key: 'lion', label: 'לביאה', bg: '#e4f5ea', c: '#12803c', dot: '#16a34a' };
    if (score >= CRED_RED_THRESHOLD)
        return { key: 'pale', label: 'טעון שיפור', bg: '#fdf1d4', c: '#9a6414', dot: '#d97706' };
    return { key: 'red', label: 'סיכון נטישה', bg: '#fdeaea', c: '#b91c1c', dot: '#dc2626' };
}
/** כל השיבוצים של בני המשפחה (כולל שהסתיימו/ברשימת-המתנה — להיסטוריה/דוחות). */
