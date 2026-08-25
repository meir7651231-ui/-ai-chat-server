// בדיקת-חוזה (רתמת-זהב) · parseAyinSheet — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-ayin-sheet.test.mjs:
//   אותם קלטים (rows/supporters/normName) ⇒ אותם פלטים. אם עובר ⇒ Dart≡JS.
// deepEq = מקבילה ל-deepStrictEqual: Map (סט-מפתחות זהה + רקורסיה) · List (אורך + איבר-איבר)
//   — סדר-בלתי-תלוי, null==null (אין undefined מעורב). לא join (כלל-המרה 8).
// הרצה: dart run --enable-asserts new/dart-maor/parse-ayin-sheet_test.dart  ⇒ exit 0

import 'parse-ayin-sheet.dart';

// שקע-normName לבדיקה — רוח המקור: lowercase + הסרת כל הרווחים (parse-ayin-sheet.test.mjs).
String normName(dynamic s) => s.toString().toLowerCase().replaceAll(RegExp(r'\s'), '');

bool deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  final sups = [
    {
      'id': 's1',
      'name': 'רחל כהן',
      'ayin': {
        'names': [
          {'id': 'n1', 'name': 'משה בן שרה'},
          {'id': 'n2', 'name': 'דוד'},
        ]
      }
    },
  ];
  final header = ['תומכת', 'שם למסירה', 'כמה עיניים', 'נמסר', 'שולם', 'תשובה', 'עופרת'];

  var f = 0;
  void check(String tag, dynamic got, dynamic want) {
    if (!deepEq(got, want)) {
      // ignore: avoid_print
      print('✗ $tag ⇒ got=$got  want=$want');
      f = 1;
    }
  }

  // 1. פחות מ-2 שורות ⇒ שגיאת קובץ-ריק
  check('1 empty-file', parseAyinSheet([header], sups, normName),
      {'upds': [], 'miss': 0, 'error': 'הקובץ ריק או לא בפורמט CSV'});

  // 2. חסרה עמודת עיניים ⇒ שגיאת עמודות-חובה
  check(
      '2 missing-cols',
      parseAyinSheet([
        ['תומכת', 'שם למסירה'],
        ['רחל כהן', 'דוד']
      ], sups, normName),
      {'upds': [], 'miss': 0, 'error': 'חסרות עמודות "שם למסירה" ו/או "כמה עיניים"'});

  // 3. שורה מלאה — התאמת תומכת+שם, clean בולע רווח-כפול
  check(
      '3 full-row',
      parseAyinSheet([
        header,
        ['רחל כהן', 'משה  בן שרה', '5', 'כן', '', '', '']
      ], sups, normName),
      {
        'upds': [
          {'supporterId': 's1', 'nameId': 'n1', 'eyes': 5, 'done': true, 'paid': null, 'answer': null, 'lead': null}
        ],
        'miss': 0
      });

  // 4. תומכת ריקה ⇒ התאמת-שם בלבד · eyes=0 תקין · 'שולם' עובר yes · lead 'כן'
  check(
      '4 no-supporter',
      parseAyinSheet([
        header,
        ['', 'דוד', '0', '', 'שולם', 'יש תשובה', 'כן']
      ], sups, normName),
      {
        'upds': [
          {'supporterId': 's1', 'nameId': 'n2', 'eyes': 0, 'done': null, 'paid': true, 'answer': 'יש תשובה', 'lead': true}
        ],
        'miss': 0
      });

  // 5. שם לא-קיים ⇒ miss
  check(
      '5 unknown-name',
      parseAyinSheet([
        header,
        ['רחל כהן', 'לא קיים', '3', '', '', '', '']
      ], sups, normName),
      {'upds': [], 'miss': 1});

  // 6. שורה בלי שום ערך ⇒ מדולגת בשקט
  check(
      '6 blank-row',
      parseAyinSheet([
        header,
        ['רחל כהן', 'דוד', '', '', '', '', '']
      ], sups, normName),
      {'upds': [], 'miss': 0});

  // 7. עיניים לא-ספרתיות ובלי ערך אחר ⇒ מדולגת
  check(
      '7 non-numeric-eyes',
      parseAyinSheet([
        header,
        ['רחל כהן', 'דוד', 'אבג', '', '', '', '']
      ], sups, normName),
      {'upds': [], 'miss': 0});

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      deepEq(
          parseAyinSheet([
            header,
            ['רחל כהן', 'משה בן שרה', '7', 'כן', 'שולם', 'הערה', 'לא']
          ], sups, normName),
          {
            'upds': [
              {'supporterId': 's1', 'nameId': 'n1', 'eyes': 7, 'done': true, 'paid': true, 'answer': 'הערה', 'lead': false}
            ],
            'miss': 0
          }),
      'assert-live guard');

  if (f != 0) throw StateError('FAIL parse-ayin-sheet: דוגמת-חוזה סטתה');
  // ignore: avoid_print
  print('✓ parse-ayin-sheet: 7 דוגמאות-חוזה (שקע normName) — ירוק');
}
