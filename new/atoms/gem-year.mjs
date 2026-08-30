/** חוט · gem-year — שנה עברית⇒גימטריה מקוצרת (mod 1000). חוזה: gem-year.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrew.ts; התלות gem הפכה שקע (חוק-1). */
export function gemYear(y, gem, T) {
  return gem(+y % T.k1);
}
