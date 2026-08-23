/** חוט · heb-parts — לועזי⇒עברי דרך Intl. חוזה: heb-parts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrew.ts */
const fmtParts = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
export function hebParts(d) {
  if (isNaN(d.getTime())) return { day: 0, month: '', year: 0 }; // תאריך שבור ⇒ חלקים בטוחים (כמו במקור)
  const parts = fmtParts.formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  return { day: +get('day'), month: get('month'), year: +get('year') };
}
