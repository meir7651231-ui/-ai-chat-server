/** חוט · enrollment-quote — שער+נירמול לתמחור-משוקלל משיבוץ. חוזה: enrollment-quote.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:298-303; השכן weightedQuote
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function enrollmentQuote(c, e, weightedQuote) {
  if (!c.perLesson || !e.freq || !e.freqUnit || !e.term) return null;
  return weightedQuote(c, { freq: e.freq, unit: e.freqUnit, term: e.term, months: e.termMonths, tier: e.tier || '' });
}
