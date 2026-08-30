import { integerInWords as __pure_integerInWords } from './integer-in-words.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_integerInWords_INTEGER_IN_WORDS_T = {
  k1: "אפס",
  k2: "מיליון",
  k3: "שני מיליון",
  k4: " מיליון",
};
const integerInWords = (...a) => __pure_integerInWords(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_integerInWords_INTEGER_IN_WORDS_T);
// שקעים אמיתיים כלשון-המקור (maor/src/lib/hebrewNumber.ts — מקומיים לבדיקה;
// הבדיקה מייבאת רק את האטום שלה)
const ONES = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const TEENS = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
const TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const HUNDREDS = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];
const THOUSAND_CONSTRUCT = { 3: 'שלושת', 4: 'ארבעת', 5: 'חמשת', 6: 'ששת', 7: 'שבעת', 8: 'שמונת', 9: 'תשעת', 10: 'עשרת' };
function words0_999(n) {
  const out = [];
  const h = Math.floor(n / 100);
  const rem = n % 100;
  if (h) out.push(HUNDREDS[h]);
  if (rem) {
    if (rem < 10) out.push(ONES[rem]);
    else if (rem < 20) out.push(TEENS[rem - 10]);
    else {
      const t = Math.floor(rem / 10);
      const u = rem % 10;
      out.push(TENS[t]);
      if (u) out.push(ONES[u]);
    }
  }
  return out;
}
function joinHeb(words) {
  const w = words.filter(Boolean);
  if (w.length === 0) return '';
  if (w.length === 1) return w[0];
  return w.slice(0, -1).join(' ') + ' ו' + w[w.length - 1];
}
function thousandWords(th) {
  if (th === 1) return ['אלף'];
  if (th === 2) return ['אלפיים'];
  if (THOUSAND_CONSTRUCT[th]) return [THOUSAND_CONSTRUCT[th] + ' אלפים'];
  return [joinHeb(words0_999(th)) + ' אלף'];
}

const iw = (n) => integerInWords(n, joinHeb, words0_999, thousandWords);
const C = [
  [0, 'אפס'],
  [123, 'מאה עשרים ושלושה'],
  [3000, 'שלושת אלפים'],
  [18000, 'שמונה עשר אלף'], // הבאג ההיסטורי — לא "שמונה עשר ואלף"
  [2000005, 'שני מיליון וחמישה'],
  [1234567, 'מיליון מאתיים שלושים וארבעה אלף חמש מאות שישים ושבעה'],
  [-1, null],
  [1.5, null],
  [1000000000, null],
];
let f = 0;
for (const [n, w] of C) {
  const g = iw(n);
  if (g !== w) { console.error(`✗ ${n} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ integer-in-words: 9 דוגמאות-חוזה — ירוק');
