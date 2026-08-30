/** חוט · env-path — קודם אוטומטית (אפיון-Golden). חוזה: env-path.contract.md */
export function envPath(slug, cloudRoot, T) {
    return cloudRoot ? T.k1 : T.k2 + slug + T.k3;
}
/** מסלול-B: שם-אוסף התרומות-הנפרד (doc-per-donation, מפתח=rid). לא ב-ENTITY_COLLECTIONS. */
