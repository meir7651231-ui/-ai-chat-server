// בדיקת-חוזה (רתמת-זהב) · dupFields — מייבאת אך ורק את האטום-שלה (חוק-4).
// תשע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/dup-fields.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/dup-fields_test.dart  ⇒ exit 0
import 'dup-fields.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

DupField by(String k) => dupFields.firstWhere((d) => d.key == k);

void main() {
  // 1) 18 שדות.
  ok(dupFields.length == 18, '18 שדות');
  // 2) שדה ראשון name/שם משפחה.
  ok(dupFields[0].key == 'name' && dupFields[0].label == 'שם משפחה', 'שדה ראשון name/שם משפחה');
  // 3) שדה אחרון notes.
  ok(dupFields[17].key == 'notes', 'שדה אחרון notes');
  // 4) get name על {name:'כהן'} ⇒ 'כהן'.
  ok(by('name').get({'name': 'כהן'}) == 'כהן', "get name על {name:'כהן'} ⇒ 'כהן'");
  // 5) get phone על {} ⇒ ריק.
  ok(by('phone').get({}) == '', 'get phone על {} ⇒ ריק');
  // 6) kidsHome 3 ⇒ "3".
  ok(by('kidsHome').get({'kidsHome': 3}) == '3', 'kidsHome 3 ⇒ "3"');
  // 7) kidsHome 0 ⇒ "0" (אפס אינו ריק).
  ok(by('kidsHome').get({'kidsHome': 0}) == '0', 'kidsHome 0 ⇒ "0" (אפס אינו ריק)');
  // 8) kidsMarried חסר ⇒ ריק.
  ok(by('kidsMarried').get({}) == '', 'kidsMarried חסר ⇒ ריק');
  // 9) אין כפילויות-key.
  ok(dupFields.map((d) => d.key).toSet().length == 18, 'אין כפילויות-key');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(by('name').get({'name': 'לוי'}) == 'לוי', 'assert-live guard');

  if (_f != 0) throw StateError('dup-fields: דוגמת-חוזה נכשלה');
  // ignore: avoid_print
  print('✓ dup-fields: 9 דוגמאות-חוזה — ירוק');
}
