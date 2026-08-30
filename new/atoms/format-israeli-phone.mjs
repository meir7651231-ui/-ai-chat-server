/** חוט · format-israeli-phone — קודם אוטומטית (אפיון-Golden). חוזה: format-israeli-phone.contract.md */
export function formatIsraeliPhone(raw, T) {
    const s = String(raw || '').trim();
    let d = s.replace(/\D/g, '');
    // קידומת בינלאומית 972/00972 → 0 מקומי (מספרים מיובאים מגיעים כך)
    if (d.startsWith('00972'))
        d = '0' + d.slice(5);
    else if (d.startsWith('972'))
        d = '0' + d.slice(3);
    if (!d)
        return s;
    if (d[0] === '0') {
        if (d.length === T.k1)
            return d.slice(0, 3) + '-' + d.slice(3);
        if (d.length === 9)
            return d.slice(0, 2) + '-' + d.slice(2);
        return d;
    }
    if (d.length === 9)
        return '0' + d.slice(0, 2) + '-' + d.slice(2);
    if (d.length === 8)
        return '0' + d[0] + '-' + d.slice(1);
    return s;
}
/** נרמול טקסט לחיפוש עברי: מסיר ניקוד, אותיות סופיות → רגילות, גרשיים. */
