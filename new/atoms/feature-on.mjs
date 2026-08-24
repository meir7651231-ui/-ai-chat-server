/** חוט · feature-on — חוזה-הדגלים: מפתח חסר = פעיל, רק false מכבה, שרשור-אבות מלא.
 *  חוזה: feature-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:40-52 (תורגם TS→JS); השכן moduleOn
 *  והקבוע NAV_MODULE_KEYS הוזרקו כשקעים (חוק-1 + חוק-5 — אפס import פנימי). */
export function featureOn(cfg, key, navModuleKeys, moduleOn) {
    const parts = key.split('.');
    // כל דגל-אב (וכן הדגל עצמו) שכבוי במפורש — מכבה את הצאצא
    for (let i = 1; i <= parts.length; i++) {
        if (cfg.features?.[parts.slice(0, i).join('.')] === false)
            return false;
    }
    // מודול-הניווט (הקידומת הראשונה) כבוי — מכבה את כל הדגלים תחתיו
    const prefix = parts[0] ?? '';
    if (navModuleKeys.includes(prefix) && !moduleOn(cfg, prefix)) {
        return false;
    }
    return true;
}
