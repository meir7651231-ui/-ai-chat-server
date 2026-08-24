// בדיקת-חוזה (רתמת-זהב) · cleanSupPhones — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/clean-sup-phones.test.mjs
// (אותם קלטים→פלטים; id = (s) => s; ובדוגמה 6 השקע (s) => s.replace(/-/g,'')):
//   1) [undefined, id]                                  ⇒ []
//   2) [[], id]                                         ⇒ []
//   3) [[{num:'  0501234567  ', label:'בית'}], id]      ⇒ [{num:'0501234567', label:'בית'}]
//   4) [[{num:''},{num:'0522222222'}], id]              ⇒ [{num:'0522222222'}]
//   5) [[{num:'   '}], id]                              ⇒ []
//   6) [[{num:'050-123', label:'x'}], deDash]           ⇒ [{num:'050123', label:'x'}]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/clean-sup-phones_test.dart  ⇒ exit 0
import 'clean-sup-phones.dart';

// שקעי-הבדיקה — מקבילים למקור-ה-JS.
String _id(String s) => s;
String _deDash(String s) => s.replaceAll('-', '');

// סריאליזציה קנונית ביציבת-סדר (insertion-order כמו JSON.stringify של המקור).
String _rowKey(Map<String, dynamic> r) =>
    r.entries.map((e) => '${e.key}=${e.value}').join('|');

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

  // 1) null (undefined ב-JS) ⇒ [].
  _eq(cleanSupPhones(null, _id), <Map<String, dynamic>>[], 'null ⇒ []');
  n++;

  // 2) רשימה-ריקה ⇒ [].
  _eq(cleanSupPhones(<Map<String, dynamic>>[], _id), <Map<String, dynamic>>[], '[] ⇒ []');
  n++;

  // 3) trim של num, שאר-השדות נשמרים.
  _eq(
    cleanSupPhones([
      {'num': '  0501234567  ', 'label': 'בית'},
    ], _id),
    [
      {'num': '0501234567', 'label': 'בית'},
    ],
    'trim + שימור-label',
  );
  n++;

  // 4) num-ריק מסונן, השני נשמר.
  _eq(
    cleanSupPhones([
      {'num': ''},
      {'num': '0522222222'},
    ], _id),
    [
      {'num': '0522222222'},
    ],
    'סינון num-ריק',
  );
  n++;

  // 5) רק-רווחים ⇒ trim ל-'' ⇒ מסונן.
  _eq(
    cleanSupPhones([
      {'num': '   '},
    ], _id),
    <Map<String, dynamic>>[],
    'רווחים-בלבד מסונן',
  );
  n++;

  // 6) fixPhone מסיר מקפים, label נשמר.
  _eq(
    cleanSupPhones([
      {'num': '050-123', 'label': 'x'},
    ], _deDash),
    [
      {'num': '050123', 'label': 'x'},
    ],
    'fixPhone deDash + label',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _ser(cleanSupPhones([
          {'num': '  0501234567  ', 'label': 'בית'},
        ], _id)) ==
        'num=0501234567|label=בית',
    'assert-live guard',
  );

  print('OK cleanSupPhones: $n asserts passed');
}
