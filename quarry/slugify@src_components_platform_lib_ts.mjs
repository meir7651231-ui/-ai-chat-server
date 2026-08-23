/** 🪨 טיוטת-חוט (דרגת-מחצבה) · slugify — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:21-33 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): slugify
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function slugify(orgName, taken) {
    const lat = [...orgName.trim().toLowerCase()].map((ch) => HEB2LAT[ch] ?? ch).join('');
    let base = lat.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/--+/g, '-');
    if (base.length < 2)
        base = 'org';
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
/** סלאג חוקי — כמו orgSlugFromUrl (‏a-z0-9-, ‏2-40 תווים). */
