/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliverReceipt — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/receipt.ts:225-233 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliverReceipt, printReceipt, downloadReceipt
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliverReceipt(o, fmt) {
    if (fmt === 'pdf')
        printReceipt(o);
    else
        downloadReceipt(o);
}
/**
 * הפורמט האפקטיבי למסירה: הבחירה השמורה, אך רק כשדגל-הפיצ׳ר דלוק — כיבוי
 * `core.receipt.pdf` מחזיר את הארגון לקובץ-טקסט גם אם נבחר PDF (מתג-חירום).
 */
