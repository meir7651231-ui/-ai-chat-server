/** חוט · receipt-verify-code — קוד-אימות FNV-1a לקבלה (XXX-XXX).
 *  חוזה: receipt-verify-code.contract.md
 *  חולץ כלשונו מ-maor/src/lib/receipt.ts (receiptVerifyCode). */
export function receiptVerifyCode(rid, amount, currency, date) {
  const s = rid + '|' + amount + '|' + (currency || '₪') + '|' + date.slice(0, 10);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const code = h.toString(36).toUpperCase().padStart(7, '0').slice(-6);
  return code.slice(0, 3) + '-' + code.slice(3);
}
