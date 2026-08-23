/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hokMethodLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:745-751 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hokMethodLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hokMethodLabel(m) {
    if (m === 'bank')
        return 'הו"ק בנקאית';
    if (m === 'card')
        return 'אשראי בסליקה';
    if (m === 'cash')
        return 'מזומן חודשי';
    return m || 'אחר';
}
