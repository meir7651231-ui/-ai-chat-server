/** חוט · enroll-summary — סיכום-עבר פר-שיבוץ (רישום-לשנה-הבאה). חוזה: enroll-summary.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/reenroll-lib.ts:74-96; השכנים
 *  payBal/paidOf הוזרקו כשקעים (חוק-1 — אפס import פנימי); STATUS_LABEL היה
 *  קבוע פרטי באותו קובץ — נבלע לחוט. */

export function enrollSummary(e, payBal, paidOf, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const STATUS_LABEL = {
    active: T.k1,
    paused: T.k2,
    ended: T.k3,
    wait: T.k4,
  };

  const presents = (e.presents ?? []).length;
  const absences = (e.absences ?? []).length;
  const noshow = (e.absences ?? []).filter((a) => a.noshow).length;
  const lastPresent = (e.presents ?? []).slice().sort().slice(-1)[0] ?? '';
  return {
    presents,
    absences,
    noshow,
    balance: payBal(e),
    paid: paidOf(e),
    statusLabel: STATUS_LABEL[e.status] ?? '',
    lastPresent,
  };
}
