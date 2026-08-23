/** 🪨 טיוטת-חוט (דרגת-מחצבה) · envPath — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:59-63 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): envPath
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function envPath(slug, cloudRoot) {
    return cloudRoot ? '_enc/envelope' : 'orgs/' + slug + '/_enc/envelope';
}
/** מסלול-B: שם-אוסף התרומות-הנפרד (doc-per-donation, מפתח=rid). לא ב-ENTITY_COLLECTIONS. */
