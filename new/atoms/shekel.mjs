/** חוט · shekel — קודם אוטומטית (אפיון-Golden). חוזה: shekel.contract.md */
export function shekel(n) {
    return '₪' + Math.round(n).toLocaleString('he-IL');
}
const PRICES_LS_KEY = 'maor_prices';
/** קריאת טבלת-המחירים השמורה (מכשיר-המטמיע), או ברירת-המחדל. */
