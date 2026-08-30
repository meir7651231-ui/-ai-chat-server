/** חוט · cloud-cfg-cache-key — קודם אוטומטית (אפיון-Golden). חוזה: cloud-cfg-cache-key.contract.md */
export function cloudCfgCacheKey(slug, T) {
    return T.k1 + slug;
}
/** קריאת מטמון הקונפיג-מהענן — לעליית-מהירה/offline; null כשאין/פגום. */
