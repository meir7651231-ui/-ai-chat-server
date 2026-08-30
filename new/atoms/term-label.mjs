/** חוט · term-label — תווית-תצוגה לתקופת-חיוב; 'months' מציג את המספר ("N חודשים").
 *  חוזה: term-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:227-231; קבוע-השכן
 *  PRICING_TERMS הוזרק כשקע terms (חוק-1). */
export function termLabel(term, months, terms, T) {
  if (term === T.k1) return (months && months > 0 ? months : 1) + T.k2;
  return terms.find((x) => x.v === term)?.t ?? '';
}
