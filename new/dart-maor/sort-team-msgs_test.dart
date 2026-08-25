// בדיקת-חוזה (רתמת-זהב) · sortTeamMsgs — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 הקלטות-ה-Golden זהות ביט-אחר-ביט למקור new/atoms/sort-team-msgs.test.mjs
// (קלט-מחרוזת ⇒ פריסה לתווים בסדר-המקור — מפתח-המיון לכל תו הוא מתודת-at ⇒ הכול
// שווה ⇒ מיון יציב משאיר את סדר-המקור), ובנוסף מקרי-אמת שהוקלטו מהרצת node חיה
// (מיון-אובייקטים, יציבות, מפתח-חסר, מספרים, עירוב מספר/מחרוזת, זוג-פונדקאי, אי-מוטציה).
// השוואת-מערכים: אורך + איבר-איבר (חוק-8 — לעולם לא join).
// הרצה: dart run --enable-asserts new/dart-maor/sort-team-msgs_test.dart ⇒ OK
import 'sort-team-msgs.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// חוק-8: השוואת-מערך = אורך + איבר-איבר (בלי join).
void _eqList(List<dynamic> got, List<dynamic> want, String label) {
  _ok(got.length == want.length,
      '$label: אורך ${got.length} ≠ ${want.length}');
  for (var i = 0; i < want.length; i++) {
    _ok(got[i] == want[i], '$label[$i]: ${got[i]} ≠ ${want[i]}');
  }
}

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
      ['2', '0', '2', '6', '-', '0', '8', '-', '2', '4', 'T', '1', '2', ':', '0', '0', ':', '0', '0'],
    ],
    ['0501234567', ['0', '5', '0', '1', '2', '3', '4', '5', '6', '7']],
    ['03-1234567', ['0', '3', '-', '1', '2', '3', '4', '5', '6', '7']],
    [
      'https://x.co',
      ['h', 't', 't', 'p', 's', ':', '/', '/', 'x', '.', 'c', 'o'],
    ],
    ['שלום עולם', ['ש', 'ל', 'ו', 'ם', ' ', 'ע', 'ו', 'ל', 'ם']],
    ['12', ['1', '2']],
  ];
  for (final c in golden) {
    _eqList(sortTeamMsgs(c[0]), c[1] as List, 'Golden "${c[0]}"');
    n++;
  }

  // ── מקרי-אמת נוספים, הוקלטו מהרצת node על המקור (24.8.2026) ──

  // מערך ריק ⇒ מערך ריק (חדש).
  final empty = <dynamic>[];
  final emptyOut = sortTeamMsgs(empty);
  _eqList(emptyOut, [], 'ריק');
  _ok(!identical(emptyOut, empty), 'ריק: חייב עותק חדש, לא אותה רפרנס');
  n++;

  // מיון-אובייקטים לפי at עולה (מחרוזות-ISO — לקסיקוגרפי).
  final m1 = {'at': '2026-02'};
  final m2 = {'at': '2026-01'};
  final m3 = {'at': '2026-03'};
  final sorted = sortTeamMsgs([m1, m2, m3]);
  _ok(sorted.length == 3, 'מיון: אורך');
  _ok(identical(sorted[0], m2) && identical(sorted[1], m1) && identical(sorted[2], m3),
      'מיון-ISO: סדר שגוי (עותק-רדוד — אותן רפרנסים)');
  n++;

  // חותמות-זמן מלאות.
  final t1 = {'at': '2026-08-24T12:00:00'};
  final t2 = {'at': '2026-08-24T09:00:00'};
  final t3 = {'at': '2026-08-23T23:59:59'};
  final ts = sortTeamMsgs([t1, t2, t3]);
  _ok(identical(ts[0], t3) && identical(ts[1], t2) && identical(ts[2], t1),
      'חותמות-זמן: סדר שגוי');
  n++;

  // יציבות (חוק-1): שני 'x' שומרים סדר-הכנסה, 'a' עולה ראשון.
  final x1 = {'at': 'x', 'i': 1};
  final x2 = {'at': 'x', 'i': 2};
  final a3 = {'at': 'a', 'i': 3};
  final st = sortTeamMsgs([x1, x2, a3]);
  _ok(identical(st[0], a3) && identical(st[1], x1) && identical(st[2], x2),
      'יציבות: שווי-מפתח חייבים לשמור סדר-מקור');
  n++;

  // מפתח-חסר = undefined ⇒ כל השוואה מולו 0 ⇒ הכול נשאר במקום
  // (הוקלט מ-node: [{at:"b"},{},{at:"a"}] ⇒ ללא שינוי!).
  final bb = {'at': 'b'};
  final ee = <String, dynamic>{};
  final aa = {'at': 'a'};
  final un = sortTeamMsgs([bb, ee, aa]);
  _ok(identical(un[0], bb) && identical(un[1], ee) && identical(un[2], aa),
      'מפתח-חסר: undefined ⇒ 0 ⇒ סדר-מקור נשמר');
  n++;

  // מספרים.
  final n3 = {'at': 3};
  final n1 = {'at': 1};
  final n2 = {'at': 2};
  final ns = sortTeamMsgs([n3, n1, n2]);
  _ok(identical(ns[0], n1) && identical(ns[1], n2) && identical(ns[2], n3),
      'מספרים: סדר שגוי');
  n++;

  // עירוב מספר/מחרוזת ⇒ ToNumber: 9 < "10" (הוקלט: שני הכיוונים ⇒ [9,"10"]).
  final s10 = {'at': '10'};
  final i9 = {'at': 9};
  final mixA = sortTeamMsgs([s10, i9]);
  _ok(identical(mixA[0], i9) && identical(mixA[1], s10), 'עירוב א: 9 לפני "10"');
  final mixB = sortTeamMsgs([i9, s10]);
  _ok(identical(mixB[0], i9) && identical(mixB[1], s10), 'עירוב ב: 9 לפני "10"');
  n++;

  // מחרוזות-ספרות = לקסיקוגרפי: "10" לפני "9" (הוקלט מ-node).
  final s9 = {'at': '9'};
  final s10b = {'at': '10'};
  final lex = sortTeamMsgs([s9, s10b]);
  _ok(identical(lex[0], s10b) && identical(lex[1], s9),
      'לקסיקוגרפי: "10" לפני "9"');
  n++;

  // פריסת-מחרוזת לפי code points — זוג-פונדקאי נשאר תו אחד (הוקלט: "a😀b").
  _eqList(sortTeamMsgs('a\u{1F600}b'), ['a', '\u{1F600}', 'b'], 'זוג-פונדקאי');
  n++;

  // אי-מוטציה: המקור לא משתנה; הפלט עותק חדש עם אותן רפרנסים.
  final srcB = {'at': 'b'};
  final srcA = {'at': 'a'};
  final src = [srcB, srcA];
  final out = sortTeamMsgs(src);
  _ok(identical(src[0], srcB) && identical(src[1], srcA), 'המקור השתנה!');
  _ok(!identical(src, out), 'הפלט חייב להיות מערך חדש');
  _ok(identical(out[0], srcA) && identical(out[1], srcB),
      'עותק-רדוד: אותן רפרנסים ממוינות');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sortTeamMsgs('אב').length == 2, 'assert-live guard');

  print('OK sortTeamMsgs: $n בדיקות ירוקות (12 Golden + מקרי-אמת מוקלטים)');
}
