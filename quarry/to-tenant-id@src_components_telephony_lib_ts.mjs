/** 🪨 טיוטת-חוט (דרגת-מחצבה) · toTenantId — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:54-67 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): toTenantId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
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
