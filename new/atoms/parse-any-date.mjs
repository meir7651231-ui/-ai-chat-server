/** חוט · parse-any-date — קודם אוטומטית (אפיון-Golden). חוזה: parse-any-date.contract.md */
export function parseAnyDate(v) {
    const s = String(v || '').trim();
    if (!s)
        return '';
    // ISO: אותה אימות-קיום כמו ענף ה-D/M/Y למטה — אחרת '2015-06-31'/'2019-02-30'
    // היו נשמרים כתאריך בלתי-אפשרי (זיהום נתונים בייבוא).
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
        const y = +iso[1];
        const mon = +iso[2];
        const day = +iso[3];
        if (mon < 1 || mon > 12 || day < 1 || day > 31)
            return '';
        const probe = new Date(Date.UTC(y, mon - 1, day));
        if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mon - 1 || probe.getUTCDate() !== day)
            return '';
        return s;
    }
    const m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
    if (m) {
        const day = +m[1];
        const mon = +m[2];
        let y = +m[3];
        // ציר דו-ספרתי דינמי: עד ~10 שנים קדימה = 20xx, אחרת 19xx. מתעדכן עם הזמן —
        // היה קשיח על 26 ⇒ מ-2027 "27" היה נקרא בשקט כ-1927 (זיהום נתונים בייבוא).
        if (y < 100) {
            const cut = (new Date().getFullYear() % 100) + 10;
            y += y <= cut ? 2000 : 1900;
        }
        // אימות טווח + קיום התאריך בפועל (31/02, חודש 13 וכו' → ריק, לא זבל)
        if (mon < 1 || mon > 12 || day < 1 || day > 31)
            return '';
        const probe = new Date(Date.UTC(y, mon - 1, day));
        if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mon - 1 || probe.getUTCDate() !== day)
            return '';
        return y + '-' + String(mon).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
    if (/^\d{5}$/.test(s)) {
        const b = new Date(Date.UTC(1899, 11, 30));
        b.setUTCDate(b.getUTCDate() + +s);
        return b.toISOString().slice(0, 10);
    }
    return '';
}
