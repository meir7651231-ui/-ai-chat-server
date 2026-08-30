/** חוט · wa-link — קישור wa.me לפתיחת-שיחה. חוזה: wa-link.contract.md · שקע: waDigits
 *  חולץ כלשונו מ-maor/src/lib/wa.ts:32-37; קריאת-החוץ waDigits הוזרקה כשקע
 *  (חוק-1 — אפס import פנימי). encodeURIComponent = סטנדרט-שפה, מותר. */
export function waLink(phone, text = '', waDigits, T) {
  const digits = waDigits(phone);
  if (!digits) return null;
  const t = text.trim();
  return T.k1 + digits + (t ? T.k2 + encodeURIComponent(t) : '');
}
