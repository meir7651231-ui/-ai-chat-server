/** חוט · phone-region — סיווג-אזור של מספר-טלפון (il/intl). חוזה: phone-region.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:261-283 (phoneRegion).
 *  אטום-טהור: אין קריאה-לשכן ⇒ אין שקע (חוק-1). קלט מחרוזת ⇒ פלט 'il' | 'intl'. */
export function phoneRegion(raw, T) {
  const s = (raw || '').replace(/[^\d+]/g, '');
  if (!s) return 'il';
  if (/^(\+?972|00972)/.test(s)) return 'il';
  if (/^\+/.test(s)) return T.k1;
  if (/^00/.test(s)) return T.k1;
  const d = s.replace(/\D/g, '');
  if (/^0\d{8,9}$/.test(d)) return 'il'; // 0 + 9/10 ספרות
  if (/^5\d{8}$/.test(d)) return 'il';   // נייד ישראלי בלי 0 מוביל
  return T.k1;
}
