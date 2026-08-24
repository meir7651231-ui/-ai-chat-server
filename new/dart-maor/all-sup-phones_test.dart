// בדיקת-חוזה (רתמת-זהב) · allSupPhones — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/all-sup-phones.test.mjs
// (אותם קלטים→פלטים; השקע reg = (n) => n.startsWith('0') ? 'il' : 'intl'):
//   1) {}                                          ⇒ []
//   2) {phone:'0501234567'}                        ⇒ [ראשי il primary:true]
//   3) {phone:'+15551234'}                         ⇒ [ראשי intl primary:true]
//   4) {phones:[{num:'0521111111',label:'בית',wa:true}]} ⇒ [נוסף il primary:false wa:true]
//   5) {phones:[{num:''},{num:'0523333333',note:'נייד'}]} ⇒ [רק השני — ריק-num מדולג]
//   6) {phone:'0501234567',phones:[{num:'0522222222'}]}   ⇒ [ראשי, נוסף]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/all-sup-phones_test.dart  ⇒ exit 0
import 'all-sup-phones.dart';

// שקע-הבדיקה — מקביל ל-reg = (n) => n.startsWith('0') ? 'il' : 'intl' במקור-ה-JS.
String _reg(String n) => n.startsWith('0') ? 'il' : 'intl';

// סריאליזציה קנונית (סדר-מפתחות קבוע) — מקבילת JSON.stringify של המקור, אך יציבת-סדר.
String _rowKey(Map<String, dynamic> r) =>
    'num=${r['num']}|label=${r['label']}|note=${r['note']}|'
    'wa=${r['wa']}|region=${r['region']}|primary=${r['primary']}';

String _ser(List<Map<String, dynamic>> rows) => rows.map(_rowKey).join('  ;  ');

void _eq(List<Map<String, dynamic>> got, List<Map<String, dynamic>> want, String label) {
  final g = _ser(got);
  final w = _ser(want);
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // 1) תורם ריק ⇒ אין שורות.
  _eq(allSupPhones(<String, dynamic>{}, _reg), <Map<String, dynamic>>[], '{} ⇒ []');
  n++;

  // 2) טלפון-ראשי ישראלי.
  _eq(
    allSupPhones(<String, dynamic>{'phone': '0501234567'}, _reg),
    [
      {'num': '0501234567', 'label': '', 'note': '', 'wa': false, 'region': 'il', 'primary': true},
    ],
    'ראשי il',
  );
  n++;

  // 3) טלפון-ראשי בינלאומי (לא מתחיל ב-0).
  _eq(
    allSupPhones(<String, dynamic>{'phone': '+15551234'}, _reg),
    [
      {'num': '+15551234', 'label': '', 'note': '', 'wa': false, 'region': 'intl', 'primary': true},
    ],
    'ראשי intl',
  );
  n++;

  // 4) טלפון-נוסף עם label + wa:true.
  _eq(
    allSupPhones(<String, dynamic>{
      'phones': [
        {'num': '0521111111', 'label': 'בית', 'wa': true},
      ],
    }, _reg),
    [
      {'num': '0521111111', 'label': 'בית', 'note': '', 'wa': true, 'region': 'il', 'primary': false},
    ],
    'נוסף wa+label',
  );
  n++;

  // 5) ריק-num מדולג; note נשמר.
  _eq(
    allSupPhones(<String, dynamic>{
      'phones': [
        {'num': ''},
        {'num': '0523333333', 'note': 'נייד'},
      ],
    }, _reg),
    [
      {'num': '0523333333', 'label': '', 'note': 'נייד', 'wa': false, 'region': 'il', 'primary': false},
    ],
    'דילוג ריק-num',
  );
  n++;

  // 6) ראשי + נוסף בסדר.
  _eq(
    allSupPhones(<String, dynamic>{
      'phone': '0501234567',
      'phones': [
        {'num': '0522222222'},
      ],
    }, _reg),
    [
      {'num': '0501234567', 'label': '', 'note': '', 'wa': false, 'region': 'il', 'primary': true},
      {'num': '0522222222', 'label': '', 'note': '', 'wa': false, 'region': 'il', 'primary': false},
    ],
    'ראשי+נוסף',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _ser(allSupPhones(<String, dynamic>{'phone': '+15551234'}, _reg)) ==
        'num=+15551234|label=|note=|wa=false|region=intl|primary=true',
    'assert-live guard',
  );

  print('OK allSupPhones: $n asserts passed');
}
