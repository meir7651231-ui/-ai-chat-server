/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hasPublicSite — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:242-246 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hasPublicSite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hasPublicSite(config) {
    return !!config.site && config.site.enabled !== false;
}
/** קישור-התרומה האפקטיבי — site.donateUrl, ואם אין, integrations.payments.payUrl. */
