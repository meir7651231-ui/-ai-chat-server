/** 🪨 טיוטת-חוט (דרגת-מחצבה) · setCloudScope — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:79-99 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): setCloudScope, scopedCol, colPath, scopedMeta, metaPath, scopedEnv, envPath, scopedDonations, donationsPath, donationSplitOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function setCloudScope(slug, cloudRoot) {
    scope = { slug, cloudRoot };
}
/** נתיב אוסף/מטא בתחום הנוכחי — עטיפות דקות על ה-helpers הטהורים. */
function scopedCol(col) {
    return colPath(scope.slug, scope.cloudRoot, col);
}
function scopedMeta() {
    return metaPath(scope.slug, scope.cloudRoot);
}
function scopedEnv() {
    return envPath(scope.slug, scope.cloudRoot);
}
function scopedDonations() {
    return donationsPath(scope.slug, scope.cloudRoot);
}
/* ── מסלול-B: פיצול-תרומות (דגל-אב, off-by-default, מגודר גם מ-cloudRoot) ── */
let splitOn = false;
/** נקבע מ-connectCloud לפי donationSplitOn(config). */
