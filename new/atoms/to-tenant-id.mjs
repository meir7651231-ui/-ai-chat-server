/** חוט · to-tenant-id — קודם אוטומטית (אפיון-Golden). חוזה: to-tenant-id.contract.md */
export function toTenantId(slug, orgName) {
    const base = (slug && slug !== 'default' ? slug : orgName || 'org')
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 38);
    const padded = base.length >= 3 ? base : `${base}-org`;
    return /^[a-z0-9]/.test(padded) ? padded : `x-${padded}`.slice(0, 40);
}
/**
 * ממיר תצורת-אשף ל-raw-tenant שהמנוע מקבל. ערוצי-שער מוקצים אוטומטית ל-SIM-ים.
 * @param tc תצורת-האשף @param orgName שם-הארגון @param tenantId slug
 */
