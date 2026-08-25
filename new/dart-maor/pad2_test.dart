// בדיקת-חוזה (רתמת-זהב) · pad2 — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pad2.test.mjs (12 הקלטות-Golden):
//   ""⇒"00" · "אבג"⇒"אבג" · "כהן לוי"⇒"כהן לוי" · "abc"⇒"abc" · "a@b.com"⇒"a@b.com" ·
//   "2026-08-24"⇒"2026-08-24" · "2026-08-24T12:00:00"⇒verbatim · "0501234567"⇒verbatim ·
//   "03-1234567"⇒verbatim · "https://x.co"⇒verbatim · "שלום עולם"⇒verbatim · "12"⇒"12"
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pad2_test.dart  ⇒ exit 0
import 'pad2.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-החוזה verbatim (pad2.test.mjs) —
  _eq(pad2(''), '00', '1 empty -> 00');                                        n++;
  _eq(pad2('אבג'), 'אבג', '2 hebrew');                                          n++;
  _eq(pad2('כהן לוי'), 'כהן לוי', '3 hebrew name');                             n++;
  _eq(pad2('abc'), 'abc', '4 abc');                                            n++;
  _eq(pad2('a@b.com'), 'a@b.com', '5 email');                                  n++;
  _eq(pad2('2026-08-24'), '2026-08-24', '6 date');                             n++;
  _eq(pad2('2026-08-24T12:00:00'), '2026-08-24T12:00:00', '7 datetime');       n++;
  _eq(pad2('0501234567'), '0501234567', '8 phone');                            n++;
  _eq(pad2('03-1234567'), '03-1234567', '9 landline');                         n++;
  _eq(pad2('https://x.co'), 'https://x.co', '10 url');                         n++;
  _eq(pad2('שלום עולם'), 'שלום עולם', '11 hebrew phrase');                       n++;
  _eq(pad2('12'), '12', '12 two-char');                                        n++;

  assert(n == 12, 'expected 12 golden cases, ran $n');
  print('✓ pad2: $n הקלטות-Golden — Dart≡JS ירוק');
}
