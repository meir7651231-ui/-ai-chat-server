/** חוט · iso-to-heb-parts — לועזי→עברי: ISO ⇒ {day, monthHe, year} | null. חוזה: iso-to-heb-parts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts:106-115; השכנים hebParts (חלקי-עברי
 *  דרך Intl) ו-monthHeOf (תווית עברית) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function isoToHebParts(iso, hebParts, monthHeOf) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return null;
  const p = hebParts(d);
  const monthHe = monthHeOf(p.month);
  if (!monthHe || !p.day || !p.year) return null;
  return { day: p.day, monthHe, year: p.year };
}
