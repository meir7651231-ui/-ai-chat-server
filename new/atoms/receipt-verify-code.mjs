/** חוט · receipt-verify-code — קוד-אימות FNV-1a לקבלה (XXX-XXX).
 *  חוזה: receipt-verify-code.contract.md
 *  חולץ כלשונו מ-maor/src/lib/receipt.ts (receiptVerifyCode). */
export function receiptVerifyCode(rid, amount, currency, date, T) {
  const s = rid + '|' + amount + '|' + (currency || '₪') + '|' + date.slice(0, T.k1);
  let h = T.k2;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, T.k3) >>> 0;
  }
  const code = h.toString(T.k4).toUpperCase().padStart(7, '0').slice(-6);
  return code.slice(0, 3) + '-' + code.slice(3);
}
