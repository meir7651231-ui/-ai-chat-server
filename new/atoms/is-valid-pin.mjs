/** חוט · is-valid-pin — קודם אוטומטית (אפיון-Golden). חוזה: is-valid-pin.contract.md */
export function isValidPin(pin) {
    return /^\d{4,8}$/.test(pin);
}
/** גיבוב הקוד ל-hex של SHA-256 (עם מלח). */
