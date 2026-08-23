/** 🪨 טיוטת-חוט (דרגת-מחצבה) · siteLangs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:191-197 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): siteLangs
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function siteLangs(site) {
    const raw = site?.langs?.filter((l) => SITE_LANGS.includes(l)) ?? [];
    const uniq = [...new Set(raw)];
    return uniq.length ? uniq : ['he'];
}
/** תווית-הממשק לשפה (עם נפילה לעברית אם השפה לא-מוכרת). */
