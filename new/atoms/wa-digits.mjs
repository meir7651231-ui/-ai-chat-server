/** חוט · wa-digits — קודם אוטומטית (אפיון-Golden). חוזה: wa-digits.contract.md */
export function waDigits(phone, T) {
    let d = (phone || '').replace(/\D/g, '');
    if (!d)
        return null;
    if (d.startsWith('00972'))
        d = '972' + d.slice(5);
    else if (d.startsWith('00'))
        d = d.slice(2); // קידומת חיוג בינ"ל כללית
    if (d.startsWith('9720'))
        d = '972' + d.slice(4); // ‎+972 שנשמר עם ה-0 המקומי
    if (!d.startsWith('972') && !d.startsWith('0') && (d.length === 8 || d.length === 9)) {
        d = '0' + d; // ישראלי בלי 0 מוביל — אותו דין כמו formatIsraeliPhone
    }
    if (d.startsWith('0')) {
        if (d.length === 9 || d.length === T.k1)
            d = '972' + d.slice(1);
        else
            return null; // 0-מוביל באורך אחר = לא-תקין ל-wa.me — עדיף בלי כפתור
    }
    if (d.length < 8 || d.length > T.k2)
        return null; // גבולות E.164
    return d;
}
/** קישור פתיחת-שיחה: https://wa.me/<digits>[?text=…]. בלי מספר תקין ⇒ null. */
