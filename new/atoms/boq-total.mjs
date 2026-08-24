/** חוט · boq-total — סה"כ כתב-הכמויות של תיק. חוזה: boq-total.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:99-101; השכן boqLineAmount (סכום-שורה)
 *  הוזרק כשקע (חוק-1 — אפס import פנימי; קיים כאטום-אחות boq-line-amount). */
export function boqTotal(a, boqLineAmount) {
  return a.names.reduce((t, n) => t + boqLineAmount(n), 0);
}
