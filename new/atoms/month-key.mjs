/** חוט · month-key — קודם אוטומטית (אפיון-Golden). חוזה: month-key.contract.md */
export function monthKey(iso) {
    return iso.slice(0, 7);
}
/** תצוגת חודש MM/YYYY. */
