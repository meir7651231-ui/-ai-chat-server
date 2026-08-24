// בדיקת-חוזה (רתמת-זהב) · filterCollections — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/filter-collections.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// שקע נאמן-למקור (date-util.ts:30-32): dateInRange כוללני על מחרוזות-ISO.
// הרצה: dart run --enable-asserts new/dart-maor/filter-collections_test.dart  ⇒ exit 0
import 'filter-collections.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-רשימות איבר-איבר (DART-PORTING-RULES כלל 8 — לא join).
bool _listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

// שקע נאמן-למקור: (!from || iso>=from) && (!to || iso<=to) — השוואת-מחרוזות כוללנית.
bool dateInRange(String iso, String fromIso, String toIso) =>
    (fromIso.isEmpty || iso.compareTo(fromIso) >= 0) &&
    (toIso.isEmpty || iso.compareTo(toIso) <= 0);

List<String> dates(List<Map<String, dynamic>> rows) =>
    rows.map((r) => r['date'] as String).toList();

void main() {
  var n = 0;

  final k1 = {'date': '2026-01-05', 'campaignId': 'c1', 'amount': 100};
  final k2 = {'date': '2026-02-10', 'campaignId': '', 'amount': 50};
  final k3 = {'date': '2026-03-15', 'campaignId': 'c1', 'amount': 70};
  final box = {
    'collections': [k1, k2, k3]
  };

  // דוגמה 1 · טווח כוללני — קצה-תחתון על from בדיוק.
  _ok(
      _listEq(dates(filterCollections(box, '2026-01-05', '2026-02-28', '', dateInRange)),
          ['2026-01-05', '2026-02-10']),
      'דוגמה 1 · טווח כוללני');
  n++;

  // דוגמה 2 · בלי גבולות ⇒ שלושתם.
  _ok(filterCollections(box, '', '', '', dateInRange).length == 3, 'דוגמה 2 · בלי גבולות');
  n++;

  // דוגמה 3 · מבצע c1 (בלי טווח) ⇒ [k1,k3].
  _ok(
      _listEq(dates(filterCollections(box, '', '', 'c1', dateInRange)),
          ['2026-01-05', '2026-03-15']),
      'דוגמה 3 · מבצע c1');
  n++;

  // דוגמה 4 · שילוב טווח+מבצע ⇒ [k3].
  _ok(
      _listEq(dates(filterCollections(box, '2026-02-01', '', 'c1', dateInRange)),
          ['2026-03-15']),
      'דוגמה 4 · שילוב טווח+מבצע');
  n++;

  // דוגמה 5 · טווח-ריק — יום לפני הריקון הראשון.
  _ok(filterCollections(box, '', '2026-01-04', '', dateInRange).isEmpty, 'דוגמה 5 · טווח-ריק');
  n++;

  // הקלט לא השתנה.
  _ok((box['collections'] as List).length == 3, 'הקלט לא השתנה');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(filterCollections(box, '', '', '', dateInRange).length == 3, 'assert-live guard');

  print('OK filterCollections: $n asserts passed');
}
