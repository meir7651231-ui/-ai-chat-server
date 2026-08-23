/** 🪨 טיוטת-חוט (דרגת-מחצבה) · receiptFmtOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/receipt.ts:234-237 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): receiptFmtOf, featureOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function receiptFmtOf(config, ui) {
    return featureOn(config, 'core.receipt.pdf') ? ui.receiptFmt : undefined;
}
