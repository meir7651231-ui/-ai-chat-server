/** חוט · parse-any-date — קודם אוטומטית (אפיון-Golden). חוזה: parse-any-date.contract.md */
export function parseAnyDate(v, T) {
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
        if (mon < 1 || mon > T.k1 || day < 1 || day > T.k2)
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
        if (y < T.k3) {
            const cut = (new Date().getFullYear() % T.k3) + T.k4;
            y += y <= cut ? T.k5 : T.k6;
        }
        // אימות טווח + קיום התאריך בפועל (31/02, חודש 13 וכו' → ריק, לא זבל)
        if (mon < 1 || mon > T.k1 || day < 1 || day > T.k2)
            return '';
        const probe = new Date(Date.UTC(y, mon - 1, day));
        if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mon - 1 || probe.getUTCDate() !== day)
            return '';
        return y + '-' + String(mon).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    }
    if (/^\d{5}$/.test(s)) {
        const b = new Date(Date.UTC(T.k7, T.k8, T.k9));
        b.setUTCDate(b.getUTCDate() + +s);
        return b.toISOString().slice(0, T.k4);
    }
    return '';
}
