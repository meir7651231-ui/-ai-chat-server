/** 🪨 טיוטת-חוט (דרגת-מחצבה) · hebPartsOfIso — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/hebrew.ts:139-155 (17 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): hebPartsOfIso, clear, hebParts
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function hebPartsOfIso(iso) {
    let hp = hpCacheShared.get(iso);
    if (!hp) {
        if (hpCacheShared.size >= HP_CACHE_MAX)
            hpCacheShared.clear();
        hp = hebParts(new Date(iso.slice(0, 10) + 'T12:00:00'));
        hpCacheShared.set(iso, hp);
    }
    return hp;
}
/**
 * "ט״ו אלול תשפ״ו" מתוך תאריך ISO.
 * שימוש בצהריים מקומי (T12:00:00) ולא בחצות: `new Date('YYYY-MM-DD')` נפרש
 * כחצות UTC, ובאזורי זמן ממערב ל-UTC (יבשת אמריקה) זה נופל ליום הקודם מקומית
 * וגורם לתאריך העברי לסטות ביום. צהריים חסין לכך ולשעון קיץ — עקבי עם שאר
 * שכבת התאריכים (hebToIsoEn · isoToHebParts · homeData).
 */
