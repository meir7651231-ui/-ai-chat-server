/** 🪨 טיוטת-חוט (דרגת-מחצבה) · waDeliveryText — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/wa.ts:52-56 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): waDeliveryText, renderTemplate, orgOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function waDeliveryText(orgName, famName, cfg) {
    return renderTemplate(cfg, 'wa.delivery', { name: ('משפחת ' + famName).trim(), org: orgOf(orgName) });
}
/** תזכורת-תשלום ידידותית (חוגים): שם-הפריט + היתרה. */
