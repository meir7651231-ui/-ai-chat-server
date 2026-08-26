import '../dart-data-maor/holiday-of-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · holidayOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// תשע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/holiday-of.test.mjs.
// ימי-עוגן אמיתיים לפי יום-בשבוע: שבת=22.8.2026 · ראשון=23.8 · שני=24.8 · חמישי=27.8.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/holiday-of_test.dart  ⇒ exit 0
import 'holiday-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// שקעים מוזרקים — זהים לבדיקת-ה-JS.
Map Function(DateTime) hp(int day, String month) =>
    (_) => {'day': day, 'month': month, 'year': 5786};
Map scanNo30(dynamic _) => {'has30': <String>{}};                 // כסלו חסר
Map scanFull(dynamic _) => {'has30': {'Kislev', 'Heshvan'}};      // כסלו מלא
const H = {'Nisan 15': 'פסח'};                                    // שקע HOLIDAYS

void main() {
  final sat = DateTime.parse('2026-08-22T12:00:00');
  final sun = DateTime.parse('2026-08-23T12:00:00');
  final mon = DateTime.parse('2026-08-24T12:00:00');
  final thu = DateTime.parse('2026-08-27T12:00:00');

  var n = 0;

  _ok(holidayOf(mon, hp(3, 'Tevet'), scanNo30, H, term: (k)=>kTerms[k]!) == 'חנוכה',
      '1) ג׳ טבת · כסלו חסר ⇒ יום ח׳'); n++;
  _ok(holidayOf(mon, hp(3, 'Tevet'), scanFull, H, term: (k)=>kTerms[k]!) == null,
      '2) ג׳ טבת · כסלו מלא ⇒ אין'); n++;
  _ok(holidayOf(sat, hp(17, 'Tamuz'), scanNo30, H, term: (k)=>kTerms[k]!) == null,
      '3) י״ז בתמוז בשבת ⇒ נדחה'); n++;
  _ok(holidayOf(sun, hp(18, 'Tamuz'), scanNo30, H, term: (k)=>kTerms[k]!) == 'צום י״ז בתמוז (נדחה)',
      '4) י״ח בתמוז בראשון'); n++;
  _ok(holidayOf(sun, hp(10, 'Av'), scanNo30, H, term: (k)=>kTerms[k]!) == 'תשעה באב (נדחה)',
      '5) י׳ באב בראשון'); n++;
  _ok(holidayOf(sun, hp(4, 'Tishri'), scanNo30, H, term: (k)=>kTerms[k]!) == 'צום גדליה (נדחה)',
      '6) ד׳ תשרי בראשון'); n++;
  _ok(holidayOf(thu, hp(11, 'Adar'), scanNo30, H, term: (k)=>kTerms[k]!) == 'תענית אסתר (מוקדם)',
      '7) י״א אדר בחמישי'); n++;
  _ok(holidayOf(mon, hp(15, 'Nisan'), scanNo30, H, term: (k)=>kTerms[k]!) == 'פסח',
      '8) ט״ו ניסן ⇒ מפת-החגים'); n++;
  _ok(holidayOf(mon, hp(12, 'Heshvan'), scanNo30, H, term: (k)=>kTerms[k]!) == null,
      '9) יום רגיל ⇒ null'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(holidayOf(mon, hp(3, 'Tevet'), scanNo30, H, term: (k)=>kTerms[k]!) == 'חנוכה',
      'assert-live guard');

  print('OK holidayOf: $n asserts passed');
}
