/** חוט · slugify — גזירת סלאג לטיני ייחודי משם-ארגון (עברית ⇒ תעתיק).
 *  חוזה: slugify.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:21-31 (תורגם TS→JS);
 *  טבלת-התעתיק HEB2LAT (אותו קובץ, שורות 10-15) הוטבעה כקבוע-פרטי —
 *  נתון של האטום, לא קריאת-שכן (חוק-1). אפס שקעים. */

/** תעתיק אות עברית → לטינית (פשוט וצפוי — הבעלים עורך את התוצאה ממילא). */

export function slugify(orgName, taken, HEB2LAT, T) {
    const lat = [...orgName.trim().toLowerCase()].map((ch) => HEB2LAT[ch] ?? ch).join('');
    let base = lat.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/--+/g, '-');
    if (base.length < 2)
        base = T.k1;
    if (base.length > 30)
        base = base.slice(0, 30).replace(/-+$/g, '');
    if (!taken.includes(base))
        return base;
    for (let i = 2;; i++) {
        const cand = base + '-' + i;
        if (!taken.includes(cand))
            return cand;
    }
}
