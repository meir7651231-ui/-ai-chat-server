/** חוט · block-reason — סיבת חסימת-יום לתזמון חוגים. חוזה: block-reason.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:80-112; רשימת החגים-המלאים
 *  (שכנת-אותו-קובץ) הוטבעה; השכנים hebParts (לוח עברי) ו-HOLIDAYS (מפת-חגים)
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */

/** חגים שבהם אין פעילות כלל (מתוך לוח החגים המשותף). */

export function blockReason(d, blockingOn = true, hebParts, holidays, FULL_HOLIDAYS, T) {
  if (!blockingOn) return null;
  const dow = d.getDay();
  if (dow === 6) return T.k1;
  if (dow === 5) return T.k2;
  const hp = hebParts(d);
  const hol = holidays[`${hp.month} ${hp.day}`];
  if (hol && FULL_HOLIDAYS.includes(hol)) return hol;
  // צום תשעה באב נדחה: כשט' באב חל בשבת, הצום נצפה בי' באב (ראשון). ט' באב עצמו
  // נחסם כ'שבת', אך י' באב — הצום בפועל — נחסם כאן כדין הלוח.
  if (dow === 0 && hp.month === 'Av' && hp.day === 10) return T.k3;
  if ((hp.month === T.k4 && hp.day >= 16 && hp.day <= 21) || (hp.month === T.k5 && hp.day >= 16 && hp.day <= 20))
    return T.k6;
  return null;
}
