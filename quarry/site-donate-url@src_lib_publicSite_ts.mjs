/** 🪨 טיוטת-חוט (דרגת-מחצבה) · siteDonateUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:247-254 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): siteDonateUrl
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function siteDonateUrl(config) {
    const direct = config.site?.donateUrl;
    if (typeof direct === 'string' && direct)
        return direct;
    const pay = config.integrations?.payments;
    const payUrl = pay && typeof pay.payUrl === 'string' ? pay.payUrl : '';
    return payUrl || null;
}
