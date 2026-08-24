/** חוט · env-path — קודם אוטומטית (אפיון-Golden). חוזה: env-path.contract.md */
export function envPath(slug, cloudRoot) {
    return cloudRoot ? '_enc/envelope' : 'orgs/' + slug + '/_enc/envelope';
}
/** מסלול-B: שם-אוסף התרומות-הנפרד (doc-per-donation, מפתח=rid). לא ב-ENTITY_COLLECTIONS. */
