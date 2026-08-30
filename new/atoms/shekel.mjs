/** חוט · shekel — קודם אוטומטית (אפיון-Golden). חוזה: shekel.contract.md */
export function shekel(n, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const PRICES_LS_KEY = T.k1;

    return '₪' + Math.round(n).toLocaleString('he-IL');
}
/** קריאת טבלת-המחירים השמורה (מכשיר-המטמיע), או ברירת-המחדל. */
