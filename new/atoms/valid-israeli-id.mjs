/** חוט · valid-israeli-id — קודם אוטומטית (אפיון-Golden). חוזה: valid-israeli-id.contract.md */
export function validIsraeliId(id) {
    const s = String(id).trim();
    if (!/^\d{5,9}$/.test(s))
        return false;
    if (!/[1-9]/.test(s))
        return false; // ת"ז של אפסים בלבד אינה תקינה
    const p = s.padStart(9, '0');
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let d = +p[i] * (i % 2 === 0 ? 1 : 2);
        if (d > 9)
            d -= 9;
        sum += d;
    }
    return sum % 10 === 0;
}
/** נרמול טלפון: מסיר רווחים/מקפים, מוסיף 0 מוביל אם חסר. */
