/** 🪨 טיוטת-חוט (דרגת-מחצבה) · safeHttpsUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:104-118 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): safeHttpsUrl, toString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function safeHttpsUrl(raw) {
    const t = (raw || '').trim();
    if (!t)
        return null;
    try {
        const u = new URL(t);
        return u.protocol === 'https:' ? u.toString() : null;
    }
    catch {
        return null;
    }
}
/**
 * מונח מותאם מהמילון — cfg.terms[key] אחרי trim אם אינו ריק, אחרת fallback.
 * דריסה ריקה / רווחים בלבד נחשבת "אין דריסה".
 */
