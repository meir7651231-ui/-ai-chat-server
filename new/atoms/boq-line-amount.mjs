/** חוט · boq-line-amount — סכום שורת כתב-כמויות. חוזה: boq-line-amount.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:94-96. עצמאי — אפס שקעים. */
export function boqLineAmount(n) {
  return (+n.eyes || 0) * (n.rate || 0);
}
