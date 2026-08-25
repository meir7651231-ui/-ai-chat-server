// בדיקת-חוזה (רתמת-זהב) · redemptionsCsvRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/redemptions-csv-rows.test.mjs:
//   NAMES = { c1:'קופון מזון', c2:'מתנה' } · itemOf = (_db,comp) => {name: NAMES[comp.id] ?? ''}
//   beneficiaryLabel = (_db,a) => a.famId==='f1' ? 'משפחת כהן' : 'משפחת לוי'
//   db: מוצר p1 'סל חג' עם רכיבים c1,c2 · a1(f1,p1) 2 מימושים · a2(f2,pZZZ) מימוש-אחד.
//   1) אורך=4 · 2) כותרת · 3) שורה1 · 4) שורה2 (cX לא-נמצא + rid חסר + מבוטל) ·
//   5) שורה3 (pZZZ לא-נמצא ⇒ פריט+חבילה '') · 6) db-ריק ⇒ כותרת-בלבד (אורך=1).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/redemptions-csv-rows_test.dart  ⇒ exit 0
import 'redemptions-csv-rows.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-עומק על מטריצת-תאים מעורבים (מקביל ל-JSON.stringify של המקור).
bool _eqRows(List<List<dynamic>> a, List<List<dynamic>> b) {
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

  // מימושי-שקע — כמוגדר בחוזה:
  const NAMES = {'c1': 'קופון מזון', 'c2': 'מתנה'};
  dynamic itemOf(Map<String, dynamic> _db, dynamic comp) =>
      {'name': NAMES[comp['id']] ?? ''};
  String beneficiaryLabel(Map<String, dynamic> _db, dynamic a, dynamic _config) =>
      a['famId'] == 'f1' ? 'משפחת כהן' : 'משפחת לוי';

  final Map<String, dynamic> db = {
    'shopProducts': [
      {
        'id': 'p1',
        'name': 'סל חג',
        'components': [
          {'id': 'c1'},
          {'id': 'c2'},
        ],
      },
    ],
    'shopAssignments': [
      {
        'famId': 'f1',
        'productId': 'p1',
        'redemptions': [
          {'date': '2026-08-01', 'componentId': 'c1', 'paid': 20, 'value': 100, 'rid': 'S-0001'},
          {'date': '2026-08-02', 'componentId': 'cX', 'paid': 0, 'value': 50, 'voidedAt': '2026-08-03'},
        ],
      },
      {
        'famId': 'f2',
        'productId': 'pZZZ',
        'redemptions': [
          {'date': '2026-08-04', 'componentId': 'c2', 'paid': 5, 'value': 30},
        ],
      },
    ],
  };

  final R = redemptionsCsvRows(db, null, beneficiaryLabel, itemOf);

  // 1 · אורך=4 (כותרת + 3 מימושים).
  _ok(R.length == 4, 'דוגמה 1: אורך ${R.length} ≠ 4');
  n++;

  // 2 · כותרת.
  _ok(
    _eqRows([R[0]], [
      ['תאריך', 'מוטב', 'פריט', 'חבילה', 'שולם', 'שווי', 'אישור', 'מבוטל'],
    ]),
    'דוגמה 2: כותרת ≠ הצפוי',
  );
  n++;

  // 3 · שורה 1.
  _ok(
    _eqRows([R[1]], [
      ['2026-08-01', 'משפחת כהן', 'קופון מזון', 'סל חג', 20, 100, 'S-0001', ''],
    ]),
    'דוגמה 3: שורה 1 ≠ הצפוי',
  );
  n++;

  // 4 · שורה 2 (רכיב cX לא-נמצא ⇒ פריט ''; rid חסר ⇒ ''; מבוטל מסומן).
  _ok(
    _eqRows([R[2]], [
      ['2026-08-02', 'משפחת כהן', '', 'סל חג', 0, 50, '', 'בוטל ב-2026-08-03'],
    ]),
    'דוגמה 4: שורה 2 ≠ הצפוי',
  );
  n++;

  // 5 · שורה 3 (מוצר pZZZ לא-נמצא ⇒ פריט+חבילה '').
  _ok(
    _eqRows([R[3]], [
      ['2026-08-04', 'משפחת לוי', '', '', 5, 30, '', ''],
    ]),
    'דוגמה 5: שורה 3 ≠ הצפוי',
  );
  n++;

  // 6 · db בלי שיוכים ⇒ כותרת בלבד (אורך=1).
  final E = redemptionsCsvRows(
    {'shopProducts': [], 'shopAssignments': []},
    null,
    beneficiaryLabel,
    itemOf,
  );
  _ok(E.length == 1, 'דוגמה 6: ריק אורך ${E.length} ≠ 1');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(redemptionsCsvRows({'shopProducts': [], 'shopAssignments': []}, null, beneficiaryLabel, itemOf).length == 1, 'assert-live guard');

  print('OK redemptionsCsvRows: $n asserts passed');
}
