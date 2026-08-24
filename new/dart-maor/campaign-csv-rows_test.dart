// בדיקת-חוזה (רתמת-זהב) · campaignCsvRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/campaign-csv-rows.test.mjs:
//   LABELS = { donated:'תרם/ה', noanswer:'לא ענה' }
//   nameOf = id ⇒ ({s7:'ראובן', s9:'שמעון'})[id] ?? '?'
//   1) יומן ריק ⇒ כותרת בלבד.
//   2+3) שורה פר-ניסיון בסדר-היומן; note חסר ⇒ ''.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/campaign-csv-rows_test.dart  ⇒ exit 0
import 'campaign-csv-rows.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-עומק על מטריצת-מחרוזות (מקביל ל-JSON.stringify של המקור).
bool _eqRows(List<List<String>> a, List<List<String>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) return false;
    for (var j = 0; j < a[i].length; j++) {
      if (a[i][j] != b[i][j]) return false;
    }
  }
  return true;
}

void main() {
  var n = 0;

  final Map<dynamic, dynamic> labels = {'donated': 'תרם/ה', 'noanswer': 'לא ענה'};
  String nameOf(dynamic id) => const {'s7': 'ראובן', 's9': 'שמעון'}[id] ?? '?';

  // 1 · יומן ריק — כותרת בלבד.
  _ok(
    _eqRows(
      campaignCsvRows({'log': []}, nameOf, labels),
      [
        ['שם', 'תוצאה', 'הערה', 'מתי'],
      ],
    ),
    'דוגמה 1: יומן ריק ≠ כותרת-בלבד',
  );
  n++;

  // 2+3 · שורה פר-ניסיון, בסדר-היומן, note חסר ⇒ ''.
  final Map<String, dynamic> c = {
    'log': [
      {'id': 's7', 'outcome': 'donated', 'note': 'הבטיח 100', 'at': '2026-08-20'},
      {'id': 's9', 'outcome': 'noanswer', 'at': '2026-08-21'},
    ],
  };
  _ok(
    _eqRows(
      campaignCsvRows(c, nameOf, labels),
      [
        ['שם', 'תוצאה', 'הערה', 'מתי'],
        ['ראובן', 'תרם/ה', 'הבטיח 100', '2026-08-20'],
        ['שמעון', 'לא ענה', '', '2026-08-21'],
      ],
    ),
    'דוגמה 2+3: שורות ≠ הצפוי',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(campaignCsvRows({'log': []}, nameOf, labels).length == 1, 'assert-live guard');

  print('OK campaignCsvRows: $n asserts passed');
}
