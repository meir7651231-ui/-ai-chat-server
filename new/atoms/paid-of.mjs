/** חוט · paid-of — סכום-ששולם. חוזה: paid-of.contract.md */
export const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
