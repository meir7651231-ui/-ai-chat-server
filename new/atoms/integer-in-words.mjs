/** חוט · integer-in-words — מספר שלם 0..999,999,999 במילים עבריות (זכר — לקבלת §46).
 *  חוזה: integer-in-words.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebrewNumber.ts:79-95; שלושת השכנים —
 *  joinHeb · words0_999 · thousandWords — הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function integerInWords(n, joinHeb, words0_999, thousandWords) {
  if (!Number.isFinite(n) || n < 0 || n > 999_999_999 || Math.floor(n) !== n) return null;
  if (n === 0) return 'אפס';
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const groups = [];
  if (millions) {
    if (millions === 1) groups.push('מיליון');
    else if (millions === 2) groups.push('שני מיליון');
    // איבר אחד — אותו באג-דפוס כמו באלפים ("שמונה עשר ומיליון")
    else groups.push(joinHeb(words0_999(millions)) + ' מיליון');
  }
  if (thousands) groups.push(...thousandWords(thousands));
  if (rest) groups.push(...words0_999(rest));
  return joinHeb(groups);
}
