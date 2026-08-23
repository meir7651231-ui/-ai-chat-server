/** 🪨 טיוטת-חוט (דרגת-מחצבה) · waPaymentText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/wa.ts:57-65 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): waPaymentText, renderTemplate, orgOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function waPaymentText(orgName, what, balance, cfg) {
    return renderTemplate(cfg, 'wa.payment', {
        org: orgOf(orgName),
        what,
        amount: Math.round(balance).toLocaleString('he-IL'),
    });
}
/** ברכת יום-הולדת לחוגג/ת. */
