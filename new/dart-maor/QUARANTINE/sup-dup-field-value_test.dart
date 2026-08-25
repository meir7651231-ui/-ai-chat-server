// בדיקת-חוזה (רתמת-זהב) · supDupFieldValue — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור new/atoms/sup-dup-field-value.test.mjs
// (החוזה והבדיקה-ב-JS חופפים 1:1), ועוד שלושה חיזוקי-המרה (כלל-15/‏??).
// ‏def={key:'phone', get:(s)=>s.phone||''} — ‏def.get חלק-מהקלט, כאן משוחזר בנאמנות:
// ‏s.phone על מפתח-חסר ⇒ undefined (null ב-Map) ⇒ ‏|| '' ⇒ ''.
// הרצה: dart run --enable-asserts new/dart-maor/sup-dup-field-value_test.dart ⇒ OK
import 'sup-dup-field-value.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// truthiness של JS עבור ה-get של הבדיקה (s.phone || '').
bool _tru(dynamic v) {
  if (v == null || v == false) return false;
  if (v is num) return !(v == 0 || v.isNaN);
  if (v is String) return v.isNotEmpty;
  return true;
}

void main() {
  var n = 0;
  final def = {
    'key': 'phone',
    'get': (dynamic s) {
      final v = s['phone'];
      return _tru(v) ? v : ''; // (s) => s.phone || ''
    },
  };
  final ab = [
    {'phone': 'A'},
    {'phone': 'B'},
  ];

  // 1) עריכה גוברת על הכול — גם כש-pick קיים.
  _ok(
    supDupFieldValue(ab, def, {'phone': 1}, {'phone': '050-1111111'}) ==
        '050-1111111',
    'edit גובר גם על pick',
  ); n++;

  // 2) עריכה ריקה = מחיקה מפורשת (!= null).
  _ok(supDupFieldValue(ab, def, {'phone': 1}, {'phone': ''}) == '',
      'מחרוזת ריקה ב-edit גוברת (מחיקה מכוונת)'); n++;

  // 3) בחירה מצביעה על רשומה 1.
  _ok(supDupFieldValue(ab, def, {'phone': 1}, {}) == 'B', 'pick=1 ⇒ B'); n++;

  // 4) אינדקס 0 הוא בחירה תקפה (?? ולא ||).
  _ok(supDupFieldValue(ab, def, {'phone': 0}, {}) == 'A', 'pick=0 ⇒ A'); n++;

  // 5) בלי pick ⇒ הרשומה הראשונה שיש לה ערך ('' שקרי ב-findIndex).
  _ok(
    supDupFieldValue([
          {'phone': ''},
          {'phone': 'C'},
        ], def, {}, {}) ==
        'C',
    'בלי pick ⇒ הרשומה הראשונה שיש לה ערך',
  ); n++;

  // 6) אף אחת בלי ערך ⇒ נופל ל-sups[0] (findIndex=-1 ⇒ 0).
  _ok(supDupFieldValue([<String, dynamic>{}, <String, dynamic>{}], def, {}, {}) == '',
      'אף ערך ⇒ sups[0] ⇒ ריק'); n++;

  // — חיזוקי-המרה (מעבר לחוזה; נאמנות-JS בקצוות) —

  // 7) null-מפורש ב-edit נופל הלאה (!= null רופף — null≡undefined במקור).
  _ok(supDupFieldValue(ab, def, {'phone': 1}, {'phone': null}) == 'B',
      'edit=null ⇒ נופל ל-pick'); n++;

  // 8) null-מפורש ב-pick נופל ל-findIndex (?? של JS ≡ ?? של Dart).
  _ok(supDupFieldValue(ab, def, {'phone': null}, {}) == 'A',
      'pick=null ⇒ findIndex ⇒ הראשונה-עם-ערך'); n++;

  // 9) כלל-15: אינדקס-מחרוזת-קנוני — JS: sups['1']≡sups[1] ו-'1'>=0 אמת.
  _ok(supDupFieldValue(ab, def, {'phone': '1'}, {}) == 'B',
      "pick='1' (מחרוזת-קנונית) ⇒ B"); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supDupFieldValue(ab, def, {'phone': 0}, {}) == 'A', 'assert-live guard');

  print('OK supDupFieldValue: $n asserts passed '
      '(edit → pick → ראשונה-עם-ערך → sups[0])');
}
