// בדיקת-חוזה (רתמת-זהב) · sortSupportMsgs — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת 1:1 את new/atoms/sort-support-msgs.test.mjs — 12 הקלטות-Golden
// (קלט-מחרוזת ⇒ spread לתווים; comparator-ה-at מחזיר 0 ⇒ סדר-המקור נשמר).
// השוואת-מערכים = אורך + איבר-איבר (כלל-8 — לעולם לא join).
// הרצה: dart run --enable-asserts new/dart-maor/sort-support-msgs_test.dart ⇒ OK
import 'sort-support-msgs.dart';

void _eqList(dynamic got, List<String> want, String label) {
  if (got is! List) {
    throw StateError('FAIL [$label]: got is not a List: $got');
  }
  if (got.length != want.length) {
    throw StateError(
        'FAIL [$label]: length ${got.length} != ${want.length} (got=$got)');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError(
          'FAIL [$label]: item $i "${got[i]}" != "${want[i]}" (got=$got)');
    }
  }
}

void main() {
  var n = 0;

  // — 12 הקלטות-ה-Golden verbatim (sort-support-msgs.test.mjs) —
  _eqList(sortSupportMsgs(''), <String>[], '1 empty');
  n++;
  _eqList(sortSupportMsgs('אבג'), ['א', 'ב', 'ג'], '2 heb');
  n++;
  _eqList(sortSupportMsgs('כהן לוי'),
      ['כ', 'ה', 'ן', ' ', 'ל', 'ו', 'י'], '3 heb name');
  n++;
  _eqList(sortSupportMsgs('abc'), ['a', 'b', 'c'], '4 abc');
  n++;
  _eqList(sortSupportMsgs('a@b.com'),
      ['a', '@', 'b', '.', 'c', 'o', 'm'], '5 email');
  n++;
  _eqList(sortSupportMsgs('2026-08-24'),
      ['2', '0', '2', '6', '-', '0', '8', '-', '2', '4'], '6 iso date');
  n++;
  _eqList(
      sortSupportMsgs('2026-08-24T12:00:00'),
      [
        '2', '0', '2', '6', '-', '0', '8', '-', '2', '4', //
        'T', '1', '2', ':', '0', '0', ':', '0', '0'
      ],
      '7 iso datetime');
  n++;
  _eqList(sortSupportMsgs('0501234567'),
      ['0', '5', '0', '1', '2', '3', '4', '5', '6', '7'], '8 mobile');
  n++;
  _eqList(sortSupportMsgs('03-1234567'),
      ['0', '3', '-', '1', '2', '3', '4', '5', '6', '7'], '9 landline');
  n++;
  _eqList(sortSupportMsgs('https://x.co'),
      ['h', 't', 't', 'p', 's', ':', '/', '/', 'x', '.', 'c', 'o'], '10 url');
  n++;
  _eqList(sortSupportMsgs('שלום עולם'),
      ['ש', 'ל', 'ו', 'ם', ' ', 'ע', 'ו', 'ל', 'ם'], '11 shalom');
  n++;
  _eqList(sortSupportMsgs('12'), ['1', '2'], '12 digits');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((sortSupportMsgs('אבג') as List).length == 3, 'assert-live guard');

  print('OK sortSupportMsgs: $n golden cases passed');
}
