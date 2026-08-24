/** חוט · pad2 — קודם אוטומטית (אפיון-Golden). חוזה: pad2.contract.md */
export function pad2(n) {
    return String(n).padStart(2, '0');
}
/** "HH:MM" → דקות מחצות; מחרוזת לא תקינה → NaN. */
