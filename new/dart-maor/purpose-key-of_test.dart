// בדיקת-חוזה (רתמת-זהב) · purposeKeyOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/purpose-key-of.test.mjs
// (אותם קלטים→פלטים; השקע purpose = d.purpose):
//   0) SHARED_PURPOSE_KEY == '_shared_'
//   1) 'בניין'    ⇒ 'בניין'      (ייעוד-אמת כלשונו)
//   2) '  חוגים  ' ⇒ 'חוגים'      (גזימת-רווחים)
//   3) ''         ⇒ '_shared_'   (ריק)
//   4) '   '      ⇒ '_shared_'   (רווחים-בלבד)
//   5) חסר (null) ⇒ '_shared_'   ({} במקור — שדה-חסר)
//   6) null       ⇒ '_shared_'   (?? מטפל גם ב-null)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/purpose-key-of_test.dart  ⇒ exit 0
import 'purpose-key-of.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =[$got]\n want=[$want]');
  }
}

void main() {
  var n = 0;

  // 0) הקבוע המיוצא.
  _eq(sharedPurposeKey, '_shared_', "SHARED_PURPOSE_KEY");
  n++;

  // 1) ייעוד-אמת מוחזר כלשונו.
  _eq(purposeKeyOf('בניין'), 'בניין', "'בניין' כלשונו");
  n++;

  // 2) גזימת-רווחים.
  _eq(purposeKeyOf('  חוגים  '), 'חוגים', 'גזימת-רווחים');
  n++;

  // 3) ריק ⇒ משותף.
  _eq(purposeKeyOf(''), '_shared_', "ריק ⇒ '_shared_'");
  n++;

  // 4) רווחים-בלבד ⇒ משותף.
  _eq(purposeKeyOf('   '), '_shared_', "רווחים-בלבד ⇒ '_shared_'");
  n++;

  // 5) purpose חסר ({} במקור) ⇒ משותף — מדגם כ-null.
  _eq(purposeKeyOf(null), '_shared_', "חסר ⇒ '_shared_'");
  n++;

  // 6) purpose=null ⇒ משותף (?? תופס null).
  _eq(purposeKeyOf(null), '_shared_', "null ⇒ '_shared_'");
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(purposeKeyOf('  חוגים  ') == 'חוגים', 'assert-live guard');

  print('OK purposeKeyOf: $n asserts passed');
}
