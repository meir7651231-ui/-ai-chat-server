/** 🪨 טיוטת-חוט (דרגת-מחצבה) · telHref — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/tel.ts:9-15 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): telHref
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function telHref(phone) {
    const cleaned = (phone || '').replace(/[^\d+]/g, '');
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length < 6)
        return null; // קצר מדי = לא מספר-חיוג תקין
    return 'tel:' + cleaned;
}
