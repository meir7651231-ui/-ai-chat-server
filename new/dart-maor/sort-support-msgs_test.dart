// בדיקת-חוזה (רתמת-זהב) · sortSupportMsgs — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 הקלטות-ה-Golden זהות ביט-אחר-ביט למקור new/atoms/sort-support-msgs.test.mjs
// (קלט-מחרוזת ⇒ פריסה לתווים בסדר-המקור — מפתח-המיון לכל תו הוא מתודת-at ⇒ הכול
// שווה ⇒ מיון-TimSort יציב משאיר את סדר-המקור).
// בנוסף: מקרי-אמת של הקומפרטור-הלא-טרנזיטיבי (at מעורב מספר/מחרוזת) שהוקלטו
// מהרצת V8/node חיה — שומרי-ההסגר (ratchet) שמוכיחים שהפורט נאמן ל-TimSort, לא
// למיון-Dart-עם-שובר-אינדקס. וכן: אי-מוטציה, מפתח-חסר, undefined/null, יציבות.
// השוואת-מערכים: אורך + איבר-איבר (חוק-8 — לעולם לא join).
// הרצה: dart run --enable-asserts new/dart-maor/sort-support-msgs_test.dart ⇒ OK
import 'sort-support-msgs.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// חוק-8: השוואת-מערך = אורך + איבר-איבר (בלי join).
void _eqList(List<dynamic> got, List<dynamic> want, String label) {
  _ok(got.length == want.length, '$label: אורך ${got.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(got[i] == want[i], '$label[$i]: ${got[i]} ≠ ${want[i]}');
  }
}

/// עוזר: מיון רשימת-אובייקטים והחזרת רצף ה-id (להשוואה מול פלט-V8 המוקלט).
List<int> _ids(List<Map<String, dynamic>> msgs) =>
    (sortSupportMsgs(msgs) as List).map((m) => (m as Map)['id'] as int).toList();

void main() {
  var n = 0;

  // ── 12 הקלטות-Golden מהחוזה (קלט ⇒ פלט, זהה-ביט) ──
  final golden = <List<dynamic>>[
    ['', <String>[]],
    ['אבג', ['א', 'ב', 'ג']],
    ['כהן לוי', ['כ', 'ה', 'ן', ' ', 'ל', 'ו', 'י']],
    ['abc', ['a', 'b', 'c']],
    ['a@b.com', ['a', '@', 'b', '.', 'c', 'o', 'm']],
    ['2026-08-24', ['2', '0', '2', '6', '-', '0', '8', '-', '2', '4']],
    [
      '2026-08-24T12:00:00',
      ['2', '0', '2', '6', '-', '0', '8', '-', '2', '4', 'T', '1', '2', ':', '0',
       '0', ':', '0', '0']
    ],
    ['0501234567', ['0', '5', '0', '1', '2', '3', '4', '5', '6', '7']],
    ['03-1234567', ['0', '3', '-', '1', '2', '3', '4', '5', '6', '7']],
    [
      'https://x.co',
      ['h', 't', 't', 'p', 's', ':', '/', '/', 'x', '.', 'c', 'o']
    ],
    ['שלום עולם', ['ש', 'ל', 'ו', 'ם', ' ', 'ע', 'ו', 'ל', 'ם']],
    ['12', ['1', '2']],
  ];
  for (final g in golden) {
    _eqList(sortSupportMsgs(g[0]) as List, g[1] as List, 'Golden ${g[0]}');
    n++;
  }

  // ── שומרי-הסגר: קומפרטור לא-טרנזיטיבי (מספר + מחרוזת) — פלט V8/TimSort מוקלט ──
  // ‏5,'abc',2 : '5<abc'=NaN=שקר, '5>abc'=שקר ⇒ 5==abc; abc==2; 5>2 (לא-טרנזיטיבי).
  _eqList(_ids([{'at': 5, 'id': 0}, {'at': 'abc', 'id': 1}, {'at': 2, 'id': 2}]),
      [0, 1, 2], 'nontrans-3');
  n++;
  _eqList(
      _ids([
        {'at': 3, 'id': 0}, {'at': 'x', 'id': 1}, {'at': 'x', 'id': 2},
        {'at': 'y', 'id': 3}, {'at': 2, 'id': 4}, {'at': 0, 'id': 5},
        {'at': 'z', 'id': 6}, {'at': 1, 'id': 7}
      ]),
      [0, 1, 2, 3, 5, 7, 4, 6],
      'nontrans-8');
  n++;
  // עירוב מחרוזות-מספריות + מספרים ('2'==2 אך '2'<'3' לקסיקוגרפית) — פלט V8 מוקלט.
  _eqList(
      _ids([
        {'at': '2', 'id': 0}, {'at': 0, 'id': 1}, {'at': 3, 'id': 2},
        {'at': 1, 'id': 3}, {'at': '2', 'id': 4}, {'at': '3', 'id': 5},
        {'at': 'y', 'id': 6}, {'at': '1', 'id': 7}, {'at': 2, 'id': 8}
      ]),
      [1, 3, 7, 0, 4, 8, 2, 5, 6],
      'nontrans-numeric-strings-9');
  n++;
  _eqList(
      _ids([
        {'at': 2, 'id': 0}, {'at': 3, 'id': 1}, {'at': 3, 'id': 2},
        {'at': 1, 'id': 3}, {'at': 'y', 'id': 4}, {'at': 2, 'id': 5},
        {'at': 'y', 'id': 6}, {'at': 'z', 'id': 7}, {'at': 3, 'id': 8},
        {'at': 2, 'id': 9}, {'at': 3, 'id': 10}, {'at': 0, 'id': 11},
        {'at': 2, 'id': 12}
      ]),
      [11, 3, 0, 5, 9, 12, 1, 2, 4, 6, 7, 8, 10],
      'nontrans-13');
  n++;

  // ── מיון-אובייקטים תקין (at הומוגני מספרי) ──
  _eqList(
      _ids([{'at': 3, 'id': 0}, {'at': 1, 'id': 1}, {'at': 2, 'id': 2}]),
      [1, 2, 0],
      'numeric-sort');
  n++;
  // מחרוזות-ISO ⇒ לקסיקוגרפי = כרונולוגי.
  _eqList(
      _ids([
        {'at': '2026-08-24T10:00', 'id': 0},
        {'at': '2026-08-24T09:00', 'id': 1},
        {'at': '2026-08-23T23:59', 'id': 2}
      ]),
      [2, 1, 0],
      'iso-string-sort');
  n++;

  // ── יציבות: at זהה ⇒ סדר-המקור נשמר (comparator 0) ──
  _eqList(
      _ids([
        {'at': 5, 'id': 0}, {'at': 5, 'id': 1}, {'at': 5, 'id': 2},
        {'at': 5, 'id': 3}
      ]),
      [0, 1, 2, 3],
      'stable-equal');
  n++;

  // ── מפתח-חסר / undefined / null (ToNumber: undefined⇒NaN⇒0-comparator, null⇒0) ──
  _eqList(
      _ids([{'id': 0}, {'at': 1, 'id': 1}, {'id': 2}]),
      [0, 1, 2],
      'missing-at-key');
  n++;

  // ── אי-מוטציה: המקור לא משתנה; הפלט מערך-חדש עם אותן רפרנסים ──
  final srcB = {'at': 3};
  final srcA = {'at': 1};
  final src = [srcB, srcA];
  final out = sortSupportMsgs(src) as List;
  _ok(identical(src[0], srcB) && identical(src[1], srcA), 'המקור השתנה!');
  _ok(!identical(src, out), 'הפלט חייב להיות מערך חדש');
  _ok(identical(out[0], srcA) && identical(out[1], srcB),
      'עותק-רדוד: אותן רפרנסים ממוינות');
  n++;

  // ── פריסת-מחרוזת לפי code points — זוג-פונדקאי נשאר תו אחד ──
  _eqList(sortSupportMsgs('a\u{1F600}b') as List, ['a', '\u{1F600}', 'b'],
      'זוג-פונדקאי');
  n++;

  // ── מערך גדול (>64) — נתיב-המיזוג של TimSort פעיל; at הומוגני ⇒ מיון תקין ──
  final big = <Map<String, dynamic>>[
    for (var i = 0; i < 200; i++) {'at': (i * 7) % 13, 'id': i}
  ];
  final bigOut = sortSupportMsgs(big) as List;
  var ok = true;
  for (var i = 1; i < bigOut.length; i++) {
    if ((bigOut[i - 1] as Map)['at'] > (bigOut[i] as Map)['at']) ok = false;
  }
  _ok(ok, 'מערך-גדול ממוין עולה');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((sortSupportMsgs('אב') as List).length == 2, 'assert-live guard');

  print('OK sortSupportMsgs: $n בדיקות ירוקות '
      '(12 Golden + שומרי-הסגר לא-טרנזיטיביים + מקרי-אמת)');
}
