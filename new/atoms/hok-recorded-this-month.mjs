/** חוט · hok-recorded-this-month — האם חיוב-החודש של הוראת-הקבע כבר נרשם. חוזה: hok-recorded-this-month.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:708-725; הקבוע-השכן HOK_CAT
 *  (קטגוריית-התרומה של הו"ק, במאור: 'הו"ק') הוזרק כשקע hokCat (חוק-1 — אפס import פנימי). */
export function hokRecordedThisMonth(sp, todayIso, hokCat) {
  if (!sp.hok) return false;
  const month = todayIso.slice(0, 7);
  const hok = sp.hok;
  const inDonations = sp.donations.some(
    (d) => d.date.startsWith(month) && (d.cat === hokCat || (d.amount === hok.amount && (d.cur || '₪') === hok.cur)),
  );
  if (inDonations) return true;
  // חיוב-נדרים כלשהו החודש ⇒ נחשב "נרשם" — **בלי דרישת-סכום-מדויק** (הו"ק בסכום-
  // משתנה, למשל שזוהתה-רטרואקטיבית, לא תוצג שגוי כ"ממתין"); נפילה: התאמת-סכום-מדויק
  // לרשומת-hist שאינה נדרים (מקור-ישן/לגאסי).
  return (sp.hist ?? []).some(
    (h) => (h.d || '').startsWith(month) && (h.clearer === 'נדרים' || h.clearer === 'סולה' || (h.a === hok.amount && (h.c || '₪') === hok.cur)),
  );
}
