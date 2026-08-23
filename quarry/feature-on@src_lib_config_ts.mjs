/** 🪨 טיוטת-חוט (דרגת-מחצבה) · featureOn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:40-62 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): featureOn, moduleOn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function featureOn(cfg, key) {
    const parts = key.split('.');
    // כל דגל-אב (וכן הדגל עצמו) שכבוי במפורש — מכבה את הצאצא
    for (let i = 1; i <= parts.length; i++) {
        if (cfg.features?.[parts.slice(0, i).join('.')] === false)
            return false;
    }
    // מודול-הניווט (הקידומת הראשונה) כבוי — מכבה את כל הדגלים תחתיו
    const prefix = parts[0] ?? '';
    if (NAV_MODULE_KEYS.includes(prefix) && !moduleOn(cfg, prefix)) {
        return false;
    }
    return true;
}
/**
 * מסלול-B — האם פיצול-התרומות פעיל לארגון זה. **off-by-default** (opt-in מפורש,
 * לא חוזה-הדגלים): נדלק רק ב-donationSplit:true. נקרא בגבול-הסנכרון בלבד.
 *
 * הכרעת-בעלים (15.8: "מה זה משנה מאור או יעקב"): גם לקוח-שורש (cloudRoot) רשאי
 * להדליק פיצול — אין סיבה שהמקורי יהיה שונה מארגון-חדש. תואם-לאחור: הדגל כבוי
 * כברירת-מחדל ⇒ ארגון-שורש שלא הדליק נשאר ביט-זהה; רק donationSplit:true מפורש
 * מפעיל. אצל שורש, אוסף-התרומות יושב בנתיב-השורש (donationsPath מטפל).
 */
