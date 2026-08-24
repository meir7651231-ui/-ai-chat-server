/** חוט · block-reason — סיבת חסימת-יום לתזמון חוגים. חוזה: block-reason.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:80-112; רשימת החגים-המלאים
 *  (שכנת-אותו-קובץ) הוטבעה; השכנים hebParts (לוח עברי) ו-HOLIDAYS (מפת-חגים)
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */

/** חגים שבהם אין פעילות כלל (מתוך לוח החגים המשותף). */
const FULL_HOLIDAYS = [
  'ראש השנה',
  'ראש השנה ב׳',
  'יום כיפור',
  'סוכות',
  'שמחת תורה',
  'פסח',
  'שביעי של פסח',
  'שבועות',
  'תשעה באב',
];

export function blockReason(d, blockingOn = true, hebParts, holidays) {
  if (!blockingOn) return null;
  const dow = d.getDay();
  if (dow === 6) return 'שבת';
  if (dow === 5) return 'יום שישי (שעתיים לפני שבת)';
  const hp = hebParts(d);
  const hol = holidays[`${hp.month} ${hp.day}`];
  if (hol && FULL_HOLIDAYS.includes(hol)) return hol;
  // צום תשעה באב נדחה: כשט' באב חל בשבת, הצום נצפה בי' באב (ראשון). ט' באב עצמו
  // נחסם כ'שבת', אך י' באב — הצום בפועל — נחסם כאן כדין הלוח.
  if (dow === 0 && hp.month === 'Av' && hp.day === 10) return 'תשעה באב (נדחה)';
  if ((hp.month === 'Tishri' && hp.day >= 16 && hp.day <= 21) || (hp.month === 'Nisan' && hp.day >= 16 && hp.day <= 20))
    return 'חול המועד';
  return null;
}
