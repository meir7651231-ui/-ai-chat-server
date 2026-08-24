/** חוט · iso-days-ago — ‏ISO מקומי של היום פחות N ימים. חוזה: iso-days-ago.contract.md
 *  חולץ כלשונו מ-maor/src/lib/date-util.ts:19-24; השכן isoLocal (פירמוט
 *  YYYY-MM-DD מקומי) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function isoDaysAgo(days, isoLocal) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return isoLocal(d);
}
