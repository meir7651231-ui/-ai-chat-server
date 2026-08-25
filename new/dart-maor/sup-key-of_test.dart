// בדיקת-חוזה (רתמת-זהב) · supKeyOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-key-of.test.mjs
// (‏sharedSupKey='_shared_' — השקע של SHARED_SUP_KEY):
//   1) {forWho:'אביגדור'}  ⇒ 'אביגדור'   (ייעוד-אמת כלשונו)
//   2) {forWho:'  רחל  '}  ⇒ 'רחל'        (חיטוי-trim)
//   3) {forWho:''}          ⇒ '_shared_'  (ריק)
//   4) {forWho:'   '}       ⇒ '_shared_'  (רווחים-בלבד)
//   5) {}                   ⇒ '_shared_'  (forWho חסר — undefined)
//   6) {forWho:null}        ⇒ '_shared_'  (?? מטפל גם ב-null)
// + שומרי-קצה: שקע-אחר · NBSP נגזם (ES-set) · U+0085 (NEL) לא נגזם (חוק-16 — JS לא גוזם NEL).
// אם עובר ⇒ Dart≡JS. הפלטים מחרוזות (לא מערכים) ⇒ כלל-8 (אורך+איבר-איבר) לא חל.
// הרצה: dart run --enable-asserts new/dart-maor/sup-key-of_test.dart  ⇒ exit 0
import 'sup-key-of.dart';

const String _shared = '_shared_';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =[$got]\n want=[$want]');
  }
}

void main() {
  var n = 0;

  // 1) ייעוד-אמת מוחזר כלשונו.
  _eq(supKeyOf({'forWho': 'אביגדור'}, _shared), 'אביגדור', "'אביגדור' כלשונו");
  n++;

  // 2) חיטוי-trim.
  _eq(supKeyOf({'forWho': '  רחל  '}, _shared), 'רחל', 'חיטוי-trim');
  n++;

  // 3) ריק ⇒ משותף.
  _eq(supKeyOf({'forWho': ''}, _shared), _shared, "ריק ⇒ '_shared_'");
  n++;

  // 4) רווחים-בלבד ⇒ משותף.
  _eq(supKeyOf({'forWho': '   '}, _shared), _shared, "רווחים-בלבד ⇒ '_shared_'");
  n++;

  // 5) forWho חסר ({} במקור — undefined) ⇒ משותף.
  _eq(supKeyOf(<String, dynamic>{}, _shared), _shared, "{} חסר ⇒ '_shared_'");
  n++;

  // 6) forWho=null מפורש ⇒ משותף (?? תופס גם null).
  _eq(supKeyOf({'forWho': null}, _shared), _shared, "null ⇒ '_shared_'");
  n++;

  // שומר-שקע: הערך המוחזר הוא הפרמטר, לא קבוע קשיח.
  _eq(supKeyOf({'forWho': '  '}, 'אחר'), 'אחר', 'שקע sharedSupKey מוזרק');
  n++;

  // שומר-חוק-16א: NBSP (U+00A0) בקבוצת-ES ⇒ נגזם (כמו JS trim).
  final nbsp = String.fromCharCode(0x00A0);
  _eq(supKeyOf({'forWho': '${nbsp}רחל$nbsp'}, _shared), 'רחל', 'NBSP נגזם');
  n++;

  // שומר-חוק-16ב: U+0085 (NEL) אינו רווח-ES ⇒ JS לא גוזם — גם אנחנו לא.
  final nel = String.fromCharCode(0x0085);
  _eq(supKeyOf({'forWho': '$nelרחל'}, _shared), '$nelרחל',
      'NEL לא נגזם (סטיית Dart.trim חסומה)');
  n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supKeyOf({'forWho': '  רחל  '}, _shared) == 'רחל', 'assert-live guard');

  print('OK supKeyOf: $n asserts passed');
}
