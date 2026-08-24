/** חוט · deliver-receipt — מברז מסירת-קבלה: 'pdf' ⇒ הדפסה, אחרת ⇒ הורדת-טקסט.
 *  חוזה: deliver-receipt.contract.md
 *  חולץ כלשונו מ-maor/src/lib/receipt.ts:225-233; השכנים printReceipt/downloadReceipt
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function deliverReceipt(o, fmt, printReceipt, downloadReceipt) {
  if (fmt === 'pdf') printReceipt(o);
  else downloadReceipt(o);
}
