import { amountInWords as __pure_amountInWords } from './amount-in-words.mjs';
const __d_amountInWords_AMOUNT_IN_WORDS_T = {
  k1: "אלף",
  k2: "אלפיים",
  k3: " אלפים",
  k4: " אלף",
  k5: " ו",
  k6: "אגורה אחת",
  k7: "שתי אגורות",
  k8: " אגורות",
  k9: "אפס",
  k10: "מיליון",
  k11: "שני מיליון",
  k12: " מיליון",
  k13: "דולר אחד",
  k14: "דולרים",
  k15: "סנט",
  k16: "שקל אחד",
  k17: "שקלים",
  k18: "אגורות",
  k19: "אפס ",
  k20: "שני ",
  k21: " ו-",
  k22: 100,
  k23: 10,
  k24: 20,
  k25: 999999999,
  k26: 1000000,
  k27: 1000,
};
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const __d_amountInWords_ONES = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const __d_amountInWords_TEENS = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
const __d_amountInWords_TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
const __d_amountInWords_HUNDREDS = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];
const __d_amountInWords_ONES_F = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'];
const __d_amountInWords_TEENS_F = ['עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה'];
const __d_amountInWords_THOUSAND_CONSTRUCT = {
      3: 'שלושת', 4: 'ארבעת', 5: 'חמשת', 6: 'ששת', 7: 'שבעת', 8: 'שמונת', 9: 'תשעת', 10: 'עשרת',
  };
const amountInWords = (...a) => __pure_amountInWords(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_amountInWords_ONES, __d_amountInWords_TEENS, __d_amountInWords_TENS, __d_amountInWords_HUNDREDS, __d_amountInWords_ONES_F, __d_amountInWords_TEENS_F, __d_amountInWords_THOUSAND_CONSTRUCT, __d_amountInWords_AMOUNT_IN_WORDS_T);
const CASES = [[["\"\""],"\"\""],[["\"אבג\""],"\"אבג\""],[["\"כהן לוי\""],"\"כהן לוי\""],[["\"abc\""],"\"abc\""],[["\"a@b.com\""],"\"a@b.com\""],[["\"2026-08-24\""],"\"2026-08-24\""],[["\"2026-08-24T12:00:00\""],"\"2026-08-24T12:00:00\""],[["\"0501234567\""],"\"0501234567\""],[["\"03-1234567\""],"\"03-1234567\""],[["\"https://x.co\""],"\"https://x.co\""],[["\"שלום עולם\""],"\"שלום עולם\""],[["\"12\""],"\"12\""]];
const de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);
let f = 0;
for (const [args, want] of CASES) { const got = JSON.stringify(amountInWords(...args.map(de))); if (got !== want) { console.error('✗ ' + args + ' ⇒ ' + got + ' ≠ ' + want); f = 1; } }
if (f) process.exit(1); console.log('✓ amount-in-words: ' + CASES.length + ' הקלטות-Golden — ירוק');
