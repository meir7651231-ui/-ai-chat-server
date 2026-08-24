/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isBarcodeSupported — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: buildsmart/app/src/lib/barcode.ts:18-26 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isBarcodeSupported, getCtor
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isBarcodeSupported() {
    return getCtor() !== null && !!navigator.mediaDevices?.getUserMedia;
}
