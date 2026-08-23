/** 🪨 טיוטת-חוט (דרגת-מחצבה) · resolveLocalized — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:177-190 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): resolveLocalized
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function resolveLocalized(t, lang) {
    if (t == null)
        return '';
    if (typeof t === 'string')
        return t;
    const pick = t[lang];
    if (typeof pick === 'string' && pick.trim())
        return pick;
    if (typeof t.he === 'string' && t.he.trim())
        return t.he;
    for (const l of SITE_LANGS) {
        const v = t[l];
        if (typeof v === 'string' && v.trim())
            return v;
    }
    return '';
}
/** רשימת השפות שהאתר מציע — ‏site.langs מסונן, ברירת-מחדל ['he']. */
