import '../dart-data-maor/collections-csv-rows-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · collectionsCsvRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/collections-csv-rows.test.mjs
// (אותם קלטים→פלטים; השקע termOf = (config,k,fb) => config.terms?.[k] ?? fb):
//   1) db ריק, config=null                 ⇒ [HDR]                              (fallback 'משפחה')
//   2) קופה #3 c1='רבקה'/f1='כהן' ריקון 120 ⇒ ['2026-08-01','רבקה','#3','כהן',120,'']
//   3) ריקון עם campaignId p1='חנוכה'       ⇒ עמודה-אחרונה 'חנוכה'
//   4) מזהים-זרים (zar)                     ⇒ '' בשם-רכז ובשם-משפחה
//   6) קופה עם 2 ריקונים                    ⇒ r.length == 4 (כותרת + 3 ריקונים)
//   5) config עם terms['entity.family']='לקוח' ⇒ הכותרת הרביעית 'לקוח'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/collections-csv-rows_test.dart  ⇒ exit 0
import 'collections-csv-rows.dart';

// שקע-הבדיקה — מקביל ל-termOf = (config,k,fb) => config.terms?.[k] ?? fb במקור-ה-JS.
String _termOf(Map<String, dynamic> config, String k, String fb) {
  final terms = config['terms'];
  if (terms is Map && terms[k] != null) return terms[k] as String;
  return fb;
}

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-עומק על שורה הטרוגנית (String|num) — מקביל ל-JSON.stringify של המקור.
bool _eqRow(List<Object> a, List<Object> b) {
  if (a.length != b.length) return false;
  for (var j = 0; j < a.length; j++) {
    if (a[j] != b[j]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  final Map<String, dynamic> emptyDb = {
    'tzBoxes': [],
    'tzCoordinators': [],
    'tzCampaigns': [],
    'families': [],
  };
  final List<Object> hdr = ['תאריך', 'רכז', 'קופה', 'משפחה', 'סכום', 'מבצע'];

  // 1 · db ריק, בלי config ⇒ כותרות-fallback בלבד.
  var r = collectionsCsvRows(emptyDb, null, _termOf, term: (k)=>kTerms[k]!);
  _ok(r.length == 1 && _eqRow(r[0], hdr), 'דוגמה 1: db ריק ≠ [HDR]');
  n++;

  // 2+3+4+6 · קופות עם ריקונים.
  final Map<String, dynamic> db = {
    'tzBoxes': [
      {
        'num': 3,
        'coordinatorId': 'c1',
        'famId': 'f1',
        'collections': [
          {'date': '2026-08-01', 'amount': 120},
          {'date': '2026-08-15', 'amount': 80, 'campaignId': 'p1'},
        ],
      },
      {
        'num': 7,
        'coordinatorId': 'zar',
        'famId': 'zar',
        'collections': [
          {'date': '2026-08-02', 'amount': 50},
        ],
      },
    ],
    'tzCoordinators': [
      {'id': 'c1', 'name': 'רבקה'},
    ],
    'tzCampaigns': [
      {'id': 'p1', 'name': 'חנוכה'},
    ],
    'families': [
      {'id': 'f1', 'name': 'כהן'},
    ],
  };
  r = collectionsCsvRows(db, null, _termOf, term: (k)=>kTerms[k]!);

  // 2 · שורה פר-ריקון עם רכז+משפחה שנמצאו, בלי מבצע.
  _ok(_eqRow(r[1], ['2026-08-01', 'רבקה', '#3', 'כהן', 120, '']), 'דוגמה 2');
  n++;
  // 3 · ריקון עם campaignId ⇒ שם-מבצע בעמודה-האחרונה.
  _ok(_eqRow(r[2], ['2026-08-15', 'רבקה', '#3', 'כהן', 80, 'חנוכה']), 'דוגמה 3');
  n++;
  // 4 · מזהים-זרים ⇒ '' בשם-רכז ובשם-משפחה.
  _ok(_eqRow(r[3], ['2026-08-02', '', '#7', '', 50, '']), 'דוגמה 4');
  n++;
  // 6 · שתי קופות, שלושה ריקונים ⇒ כותרת + 3 = 4 שורות.
  _ok(r.length == 4, 'דוגמה 6: r.length != 4 (${r.length})');
  n++;

  // 5 · מונח ארגוני דרך השקע ⇒ הכותרת הרביעית 'לקוח'.
  r = collectionsCsvRows(emptyDb, {
    'terms': {'entity.family': 'לקוח'},
  }, _termOf, term: (k)=>kTerms[k]!);
  _ok(r[0][3] == 'לקוח', 'דוגמה 5: הכותרת הרביעית != לקוח');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    collectionsCsvRows(emptyDb, null, _termOf, term: (k)=>kTerms[k]!).length == 1,
    'assert-live guard',
  );

  print('OK collectionsCsvRows: $n asserts passed');
}
