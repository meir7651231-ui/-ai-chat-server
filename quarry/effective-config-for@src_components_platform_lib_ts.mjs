/** 🪨 טיוטת-חוט (דרגת-מחצבה) · effectiveConfigFor — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:205-225 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isOrgManager, overrideOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function effectiveConfigFor(email, org, orgConfig) {
    if (isOrgManager(email, org))
        return orgConfig;
    const ov = overrideOf(email, org);
    if (!ov.modules && !ov.features)
        return orgConfig;
    const modules = { ...orgConfig.modules };
    for (const [m, v] of Object.entries(ov.modules ?? {}))
        if (v === false)
            modules[m] = false;
    const features = { ...orgConfig.features };
    for (const [k, v] of Object.entries(ov.features ?? {})) {
        if (v === false)
            features[k] = false;
        else if (v === true && GRANTABLE_STAFF_FEATURES.has(k))
            features[k] = true; // הדלקה פר-עובד
    }
    return { ...orgConfig, modules, features };
}
/**
 * ייעודי-התרומה שהעובד/ת רשאי/ת לראות (בקשת-בעלים 13.8 ג') — טהור.
 * מנהל/בעלים ⇒ null (רואה הכל). אחרת: הרשימה בכרטיס-העובד אם אינה ריקה, אחרת
 * null (בלי הגבלה). null = "בלי מסנן"; מערך = הגבלה לרשימה בלבד.
 */
