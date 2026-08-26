// בדיקת-חוזה (רתמת-זהב) · warehouseOverview — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/warehouse-overview.test.mjs
// (אותם קלטים→פלטים; שקע-norm = (s||'').trim().replace(/\s+/g,' ').toLowerCase()):
//   1) נרמול-רווחים מאחד שתי רשומות לשורת-פרויקט אחת (3+2 ⇒ 5)
//   2) שני פרויקטים — byProject יורד לפי qty (p2,p1)
//   3) מחסור: הוקצה 6 מול מלאי 4 ⇒ remaining=-2, short=true
//   4) שם-ריק מדולג; סכום 0 לא נצבר
//   5) בלי פרויקטים — הכול פנוי
//   6) qty לא-מספרי בפריט ⇒ 0 (remaining=0, short=false)
// השוואת-מערכים: אורך + איבר-איבר (חוק-8 — לעולם לא join). כשל ⇒ StateError.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/warehouse-overview_test.dart  ⇒ exit 0
import 'warehouse-overview.dart';

// שקע-הבדיקה — מקביל ל-norm של maor (warehouse.ts:23-25) במקור-ה-JS.
String _norm(dynamic s) {
  final str = (s is String && s.isNotEmpty) ? s : '';
  return str.trim().replaceAll(RegExp(r'\s+'), ' ').toLowerCase();
}

void _chk(String label, bool ok, [String detail = '']) {
  if (!ok) throw StateError('✗ $label $detail');
}

void main() {
  var n = 0;
  final paint = <String, dynamic>{'name': 'צבע לבן', 'qty': 10};

  // 1) נרמול-רווחים מאחד שתי רשומות לשורת-פרויקט אחת
  var r = warehouseOverview([paint], [
    {
      'id': 'p1',
      'name': 'פרויקט א',
      'ayin': {
        'mat': [
          {'name': 'צבע לבן', 'qty': 3},
          {'name': ' צבע  לבן ', 'qty': 2},
        ],
      },
    },
  ], _norm)[0];
  var bp = r['byProject'] as List;
  _chk(
    'נרמול-איחוד',
    r['allocated'] == 5 &&
        r['remaining'] == 5 &&
        r['short'] == false &&
        identical(r['item'], paint) &&
        bp.length == 1 &&
        bp[0]['id'] == 'p1' &&
        bp[0]['name'] == 'פרויקט א' &&
        bp[0]['qty'] == 5,
    '$r',
  );
  n++;

  // 2) שני פרויקטים — byProject יורד לפי qty (אורך + איבר-איבר, חוק-8)
  r = warehouseOverview([paint], [
    {
      'id': 'p1',
      'name': 'א',
      'ayin': {
        'mat': [
          {'name': 'צבע לבן', 'qty': 2},
        ],
      },
    },
    {
      'id': 'p2',
      'name': 'ב',
      'ayin': {
        'mat': [
          {'name': 'צבע לבן', 'qty': 7},
        ],
      },
    },
  ], _norm)[0];
  bp = r['byProject'] as List;
  _chk(
    'מיון-יורד',
    r['allocated'] == 9 &&
        r['remaining'] == 1 &&
        bp.length == 2 &&
        bp[0]['id'] == 'p2' &&
        bp[0]['qty'] == 7 &&
        bp[1]['id'] == 'p1' &&
        bp[1]['qty'] == 2,
    '$bp',
  );
  n++;

  // 3) מחסור: הוקצה מעבר-למלאי
  r = warehouseOverview([
    {'name': 'צבע לבן', 'qty': 4},
  ], [
    {
      'id': 'p1',
      'name': 'א',
      'ayin': {
        'mat': [
          {'name': 'צבע לבן', 'qty': 6},
        ],
      },
    },
  ], _norm)[0];
  _chk(
    'מחסור',
    r['allocated'] == 6 && r['remaining'] == -2 && r['short'] == true,
    '$r',
  );
  n++;

  // 4) שם-ריק מדולג; סכום 0 לא נצבר
  r = warehouseOverview([paint], [
    {
      'id': 'p1',
      'name': 'א',
      'ayin': {
        'mat': [
          {'name': '', 'qty': 9},
          {'name': 'צבע לבן', 'qty': 0},
        ],
      },
    },
  ], _norm)[0];
  bp = r['byProject'] as List;
  _chk(
    'דילוגים',
    r['allocated'] == 0 && r['remaining'] == 10 && bp.length == 0,
    '$r',
  );
  n++;

  // 5) בלי פרויקטים — הכול פנוי
  r = warehouseOverview([paint], [], _norm)[0];
  bp = r['byProject'] as List;
  _chk(
    'ריק',
    r['allocated'] == 0 &&
        r['remaining'] == 10 &&
        r['short'] == false &&
        bp.length == 0,
  );
  n++;

  // 6) qty לא-מספרי בפריט ⇒ 0
  r = warehouseOverview([
    {'name': 'ברגים', 'qty': 'x'},
  ], [], _norm)[0];
  _chk('qty-שבור', r['remaining'] == 0 && r['short'] == false, '$r');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    warehouseOverview([paint], [], _norm)[0]['remaining'] == 10,
    'assert-live guard',
  );

  print('OK warehouseOverview: $n דוגמאות-חוזה — ירוק');
}
