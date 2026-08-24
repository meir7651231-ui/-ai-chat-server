/** חוט · is-valid-slug — קודם אוטומטית (אפיון-Golden). חוזה: is-valid-slug.contract.md */
export function isValidSlug(slug) {
    return /^[a-z0-9-]{2,40}$/.test(slug);
}
/** כל 8 מפתחות המודולים — מקור אחד לפאנל ולקונפיג-הלידה. */
