/** חוט · resolve-localized — פתרון טקסט רב-לשוני: שפה מבוקשת ⇒ he ⇒ ראשון לא-ריק.
 *  חוזה: resolve-localized.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:177-190 (תורגם TS→JS); הקבוע
 *  SITE_LANGS מ-maor/src/types/config.ts:65 הוטמע פנימה (סדר-הנפילה) ומיוצא. */
export const SITE_LANGS = ['he', 'en', 'yi'];

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
