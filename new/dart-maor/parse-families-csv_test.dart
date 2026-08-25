// בדיקת-חוזה (רתמת-זהב) · parseFamiliesCsv — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-families-csv.test.mjs
// (אותם קלטים→פלטים; ה-asserts = מקור-אמת). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-families-csv_test.dart ⇒ exit 0
import 'parse-families-csv.dart';

// מימושי-שקע לבדיקה — בדיוק הגדרות-המקור (familiesImport.ts / הבדיקה JS):
//   clean = (x) => (x ?? '').replace(/\s+/g,' ').trim()
//   normName = (s) => String(s).toLowerCase().replace(/\s/g,'')
//   digits = (x) => (x || '').replace(/\D/g,'')
String _clean(dynamic x) =>
    (x == null ? '' : x.toString()).replaceAll(RegExp(r'\s+'), ' ').trim();
String _normName(dynamic s) =>
    s.toString().toLowerCase().replaceAll(RegExp(r'\s'), '');
String _digits(dynamic x) =>
    (x == null || x == false ? '' : x.toString()).replaceAll(RegExp(r'\D'), '');

const HDR = ['שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון2', 'עיר', 'כתובת', 'מס', 'רמז', 'קהילה', '', 'הערות'];

Map<String, List> _run(List dataRows, [List existing = const []]) =>
    parseFamiliesCsv([HDR, ...dataRows], existing, _clean, _normName, _digits);

int _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

// השוואת-עומק בלתי-תלוית-סדר-מפתחות (כמו deepStrictEqual של JS).
bool _deep(Object? a, Object? b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deep(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deep(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void _deepEq(Object? got, Object? want, String msg) => _ok(_deep(got, want), '$msg ⇒ got=$got');

void main() {
  // 1. שורה מלאה — כל הניקויים
  final r1 = ['כהן ישראל', '123', '052-111', 'לאה', '456', '-', 'ביתר', "רח' הרצל", '5', '', 'גור', '', ''];
  _deepEq(_run([r1]), {
    'news': [
      {
        'name': 'כהן ישראל', 'father': '', 'mother': 'לאה', 'fatherId': '123', 'motherId': '456',
        'phone': '052-111', 'phone2': '', 'email': '', 'address': "רח' הרצל 5", 'city': 'ביתר עילית',
        'status': 'active', 'maritalStatus': 'נשואים', 'language': 'עברית', 'community': 'גור', 'notes': '',
      }
    ],
    'upds': [],
  }, 'ex1: שורה מלאה');

  // 2. יריד חנוכה — הסרה מהשם + notes קבוע
  final g2 = _run([['לוי שרה - יריד חנוכה תשפ"ו', '', '', '', '', '', '', '', '', '', '', '', '']]);
  _ok(g2['news']![0]['name'] == 'לוי שרה', 'ex2: name=לוי שרה');
  _ok(g2['news']![0]['notes'] == 'השתתפה ביריד חנוכה תשפ"ו', 'ex2: notes קבוע');

  // 3. סטטוס מההערות ⇒ inactive, מצב-משפחתי ברירת-מחדל
  final g3 = _run([['כהן', '', '', '', '', '', '', '', '', '', '', '', 'סטטוס: לא פעיל']]);
  _ok(g3['news']![0]['status'] == 'inactive', 'ex3: status=inactive');
  _ok(g3['news']![0]['maritalStatus'] == 'נשואים', 'ex3: maritalStatus=נשואים');

  // 4. 'גרוש' מההערות ⇒ גרושים; עמודה-9 'אלמן' גוברת ⇒ אלמן/ה
  final g4a = _run([['כהן', '', '', '', '', '', '', '', '', '', '', '', 'סטטוס: גרושה']]);
  _ok(g4a['news']![0]['maritalStatus'] == 'גרושים', 'ex4a: גרושים');
  final g4b = _run([['כהן', '', '', '', '', '', '', '', '', 'אלמן', '', '', 'סטטוס: גרושה']]);
  _ok(g4b['news']![0]['maritalStatus'] == 'אלמן/ה', 'ex4b: אלמן/ה גובר');

  // 5. עיר 'רגיל' ⇒ ריקה · קהילה ריקה ⇒ 'חסידי'
  final g5 = _run([['כהן', '', '', '', '', '', 'רגיל', '', '', '', '', '', '']]);
  _ok(g5['news']![0]['city'] == '', 'ex5: city ריקה');
  _ok(g5['news']![0]['community'] == 'חסידי', 'ex5: community=חסידי');

  // 6. שורות מדולגות: כותרת-משנה + '#NAME?' שמתרוקן
  final g6 = _run([
    ['שם פרטי שם משפחה', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['#NAME?', '', '', '', '', '', '', '', '', '', '', '', ''],
  ]);
  _deepEq(g6, {'news': [], 'upds': []}, 'ex6: שתי שורות מדולגות');

  // 7. התאמה-לקיימת: digits שווים ⇒ upds · שונים ⇒ news · צד ריק ⇒ upds
  final row7 = ['כהן ישראל', '', '052-111', '', '', '', '', '', '', '', '', '', ''];
  final g7a = _run([row7], [{'id': 'f1', 'name': 'כהן  ישראל', 'phone': '052 111'}]);
  _ok(g7a['upds']!.length == 1, 'ex7a: upd יחיד');
  _ok(g7a['upds']![0]['id'] == 'f1', 'ex7a: id=f1');
  _ok(g7a['news']!.length == 0, 'ex7a: אין news');
  final g7b = _run([row7], [{'id': 'f1', 'name': 'כהן ישראל', 'phone': '053-999'}]);
  _ok(g7b['upds']!.length == 0, 'ex7b: אין upds');
  _ok(g7b['news']!.length == 1, 'ex7b: news יחיד');
  final g7c = _run([row7], [{'id': 'f1', 'name': 'כהן ישראל', 'phone': ''}]);
  _ok(g7c['upds']!.length == 1, 'ex7c: צד-ריק ⇒ upd');

  if (_f != 0) throw StateError('parse-families-csv: הרתמה נכשלה — Dart≠JS');
  print('✓ parse-families-csv: 7 דוגמאות-חוזה (שקעים clean/normName/digits) — ירוק');
}
