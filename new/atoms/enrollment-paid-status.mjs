/** חוט · enrollment-paid-status — סטטוס-תשלום נגזר-אוטומטית. חוזה: enrollment-paid-status.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:321-332; השכנים payBal/paidOf
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function enrollmentPaidStatus(e, payBal, paidOf) {
  if (e.paidFull) return 'paid';
  const due = e.totalDue || 0;
  if (due > 0) return payBal(e) === 0 ? 'paid' : paidOf(e) > 0 ? 'partial' : 'unpaid';
  return 'unpaid';
}
