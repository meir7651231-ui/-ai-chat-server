/** חוט · resolve-localized — פתרון טקסט רב-לשוני: שפה מבוקשת ⇒ he ⇒ ראשון לא-ריק.
 *  חוזה: resolve-localized.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:177-190 (תורגם TS→JS); הקבוע
 *  SITE_LANGS מ-maor/src/types/config.ts:65 הוטמע פנימה (סדר-הנפילה) ומיוצא. */
export const SITE_LANGS = ['he', 'en', 'yi'];

export function resolveLocalized(t, lang, T) {
    if (t == null)
        return '';
    if (typeof t === T.k1)
        return t;
    const pick = t[lang];
    if (typeof pick === T.k1 && pick.trim())
        return pick;
    if (typeof t.he === T.k1 && t.he.trim())
        return t.he;
    for (const l of SITE_LANGS) {
        const v = t[l];
        if (typeof v === T.k1 && v.trim())
            return v;
    }
    return '';
}
