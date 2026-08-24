/** 🪨 טיוטת-חוט (דרגת-מחצבה) · phoneRegion — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:261-283 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): phoneRegion
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function phoneRegion(raw) {
    const s = (raw || '').replace(/[^\d+]/g, '');
    if (!s)
        return 'il';
    if (/^(\+?972|00972)/.test(s))
        return 'il';
    if (/^\+/.test(s))
        return 'intl';
    if (/^00/.test(s))
        return 'intl';
    const d = s.replace(/\D/g, '');
    if (/^0\d{8,9}$/.test(d))
        return 'il'; // 0 + 9/10 ספרות
    if (/^5\d{8}$/.test(d))
        return 'il'; // נייד ישראלי בלי 0 מוביל
    return 'intl';
}
/** כל הטלפונים של תורם — הראשי (phone) ואז phones[], עם סיווג-אזור. דטרמיניסטי. */
