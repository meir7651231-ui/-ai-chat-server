/** חוט · month-label — קודם אוטומטית (אפיון-Golden). חוזה: month-label.contract.md */
export function monthLabel(key) {
    const [y, m] = key.split('-');
    return `${m}/${y}`;
}
/** אינדקס בן-משפחה לפי מזהה — שם + שם משפחה. */
