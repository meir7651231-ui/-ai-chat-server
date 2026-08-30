/** חוט · tel-href — טלפון שמור לקישור-חיוג tel:. חוזה: tel-href.contract.md
 *  חולץ כלשונו מ-maor/src/lib/tel.ts (telHref). */
export function telHref(phone, T) {
  const cleaned = (phone || '').replace(/[^\d+]/g, '');
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 6) return null; // קצר מדי = לא מספר-חיוג תקין
  return T.k1 + cleaned;
}
