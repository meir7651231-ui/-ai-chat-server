// בדיקת-חוזה (רתמת-זהב) · amountInWords — מייבאת אך ורק את האטום-שלה (חוק-4).
// שכבה א׳: 12 דוגמאות-החוזה verbatim ממקור-ה-JS new/atoms/amount-in-words.test.mjs
//   (כל הקלטים לא-מספריים ⇒ Number.isFinite=false ⇒ המחרוזת חוזרת כמות-שהיא).
// שכבה ב׳: קלטים מספריים — הפלטים הוקלטו מהרצת מקור-ה-JS עצמו (ground truth),
//   מוכיחים שהזהב תופס גם את מסלול-החישוב, לא רק את הנפילה. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/amount-in-words_test.dart  ⇒ exit 0
import 'amount-in-words.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — שכבה א׳: 12 דוגמאות-החוזה verbatim (amount-in-words.test.mjs) —
  _eq(amountInWords(''), '', '1 empty');                                            n++;
  _eq(amountInWords('אבג'), 'אבג', '2 heb-word');                                   n++;
  _eq(amountInWords('כהן לוי'), 'כהן לוי', '3 heb-name');                           n++;
  _eq(amountInWords('abc'), 'abc', '4 abc');                                        n++;
  _eq(amountInWords('a@b.com'), 'a@b.com', '5 email');                              n++;
  _eq(amountInWords('2026-08-24'), '2026-08-24', '6 date');                         n++;
  _eq(amountInWords('2026-08-24T12:00:00'), '2026-08-24T12:00:00', '7 datetime');   n++;
  _eq(amountInWords('0501234567'), '0501234567', '8 phone');                        n++;
  _eq(amountInWords('03-1234567'), '03-1234567', '9 phone2');                       n++;
  _eq(amountInWords('https://x.co'), 'https://x.co', '10 url');                     n++;
  _eq(amountInWords('שלום עולם'), 'שלום עולם', '11 heb-sentence');                 n++;
  _eq(amountInWords('12'), '12', '12 numeric-string-stays');                        n++;

  // — שכבה ב׳: מסלול-החישוב (₪), פלטים מהרצת מקור-ה-JS —
  _eq(amountInWords(0), 'אפס שקלים', 'n0');                                         n++;
  _eq(amountInWords(1), 'שקל אחד', 'n1');                                           n++;
  _eq(amountInWords(2), 'שני שקלים', 'n2');                                         n++;
  _eq(amountInWords(3), 'שלושה שקלים', 'n3');                                       n++;
  _eq(amountInWords(10), 'עשרה שקלים', 'n10');                                      n++;
  _eq(amountInWords(11), 'אחד עשר שקלים', 'n11');                                   n++;
  _eq(amountInWords(19), 'תשעה עשר שקלים', 'n19');                                  n++;
  _eq(amountInWords(20), 'עשרים שקלים', 'n20');                                     n++;
  _eq(amountInWords(21), 'עשרים ואחד שקלים', 'n21');                               n++;
  _eq(amountInWords(100), 'מאה שקלים', 'n100');                                     n++;
  _eq(amountInWords(101), 'מאה ואחד שקלים', 'n101');                               n++;
  _eq(amountInWords(200), 'מאתיים שקלים', 'n200');                                  n++;
  _eq(amountInWords(999), 'תשע מאות תשעים ותשעה שקלים', 'n999');                   n++;
  _eq(amountInWords(1000), 'אלף שקלים', 'n1000');                                   n++;
  _eq(amountInWords(1001), 'אלף ואחד שקלים', 'n1001');                             n++;
  _eq(amountInWords(2000), 'אלפיים שקלים', 'n2000');                                n++;
  _eq(amountInWords(3000), 'שלושת אלפים שקלים', 'n3000');                          n++;
  _eq(amountInWords(5000), 'חמשת אלפים שקלים', 'n5000');                           n++;
  _eq(amountInWords(21000), 'עשרים ואחד אלף שקלים', 'n21000');                     n++;
  _eq(amountInWords(100000), 'מאה אלף שקלים', 'n100000');                          n++;
  _eq(amountInWords(1000000), 'מיליון שקלים', 'n1e6');                              n++;
  _eq(amountInWords(2000000), 'שני מיליון שקלים', 'n2e6');                         n++;
  _eq(amountInWords(5000000), 'חמישה מיליון שקלים', 'n5e6');                       n++;
  _eq(amountInWords(999999999),
      'תשע מאות תשעים ותשעה מיליון תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשעה שקלים', 'nMax'); n++;

  // — שכבה ב׳: אגורות ונשיאת-עיגול —
  _eq(amountInWords(5.5), 'חמישה שקלים ו-חמישים אגורות', 'f5.5');                  n++;
  _eq(amountInWords(5.995), 'שישה שקלים', 'f5.995-carry');                          n++;
  _eq(amountInWords(0.5), 'אפס שקלים ו-חמישים אגורות', 'f0.5');                    n++;
  _eq(amountInWords(1.01), 'שקל אחד ו-אגורה אחת', 'f1.01');                        n++;
  _eq(amountInWords(0.99), 'אפס שקלים ו-תשעים ותשע אגורות', 'f0.99');             n++;
  _eq(amountInWords(12.34), 'שנים עשר שקלים ו-שלושים וארבע אגורות', 'f12.34');    n++;
  _eq(amountInWords(2.02), 'שני שקלים ו-שתי אגורות', 'f2.02');                     n++;
  _eq(amountInWords(1.5), 'שקל אחד ו-חמישים אגורות', 'f1.5');                      n++;

  // — שכבה ב׳: דולר/סנט (currency='$') —
  _eq(amountInWords(1, '\$'), 'דולר אחד', 'd1');                                     n++;
  _eq(amountInWords(2, '\$'), 'שני דולרים', 'd2');                                   n++;
  _eq(amountInWords(5, '\$'), 'חמישה דולרים', 'd5');                                 n++;
  _eq(amountInWords(1.01, '\$'), 'דולר אחד ו-אחד סנט', 'd1.01');                    n++;
  _eq(amountInWords(2.02, '\$'), 'שני דולרים ו-שניים סנט', 'd2.02');                n++;
  _eq(amountInWords(0.5, '\$'), 'אפס דולרים ו-חמישים סנט', 'd0.5');                 n++;
  _eq(amountInWords(5.5, '\$'), 'חמישה דולרים ו-חמישים סנט', 'd5.5');               n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(amountInWords(1) == 'שקל אחד', 'assert-live guard');

  print('OK amountInWords: $n asserts passed');
}
