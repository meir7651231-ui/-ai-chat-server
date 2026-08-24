/** חוט · export-allowed — הכרעת שער-יציאת-המידע: האם ייצוא מותר. חוזה: export-allowed.contract.md
 *  חולץ כלשונו מ-maor/src/lib/exportGate.ts:25-32; מצב-המודול `blocked`
 *  (שנקבע שם מ-App לפי הקונפיג-האפקטיבי) הוזרק כפרמטר — מצב = חיווט-קופסה (חוק-1/5). */
export function exportAllowed(blocked) {
  return !blocked;
}
