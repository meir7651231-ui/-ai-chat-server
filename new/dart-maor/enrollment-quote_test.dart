// רתמת-זהב · enrollmentQuote — Dart≡JS. מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה **בדיוק** כמו new/atoms/enrollment-quote.test.mjs (אותם קלטים→פלטים).
// הרצה: dart run --enable-asserts new/dart-maor/enrollment-quote_test.dart
import 'enrollment-quote.dart';

// שקע-לבדיקה — verbatim מבדיקת-ה-JS: מחזיר תוצאה קבועה ומתעד את הקריאה.
List<List> calls = [];
Map _wq(Map c, Map opts) {
  calls.add([c, opts]);
  return {'lessons': 8, 'perLesson': 50, 'total': 400};
}

// השוואת-מפות עמוקה — המקבילה ל-JSON.stringify(a)===JSON.stringify(b) של ה-JS
// (ערכים פרימיטיביים: int/String/null; ללא package חיצוני — dart-core בלבד).
bool _mapEq(Map a, Map b) {
  if (a.length != b.length) return false;
  for (final k in a.keys) {
    if (!b.containsKey(k)) return false;
    final av = a[k], bv = b[k];
    if (av is Map && bv is Map) {
      if (!_mapEq(av, bv)) return false;
    } else if (av != bv) {
      return false;
    }
  }
  return true;
}

void _chk(String name, bool cond) {
  if (!cond) throw StateError('✗ $name');
}

void main() {
  var n = 0;

  // 1 — לא פר-שיעור ⇒ null, אפס קריאות-שקע
  calls = [];
  _chk('דוגמה 1: null',
      enrollmentQuote({'perLesson': false, 'lessonPrice': 50},
              {'freq': 2, 'freqUnit': 'week', 'term': 'monthly'}, _wq) ==
          null); n++;
  _chk('דוגמה 1: השקע לא נקרא', calls.length == 0); n++;

  // 2 — בלי freq ⇒ null
  _chk('דוגמה 2: null',
      enrollmentQuote({'perLesson': true},
              {'freqUnit': 'week', 'term': 'monthly'}, _wq) ==
          null); n++;

  // 3 — בלי term ⇒ null
  _chk('דוגמה 3: null',
      enrollmentQuote({'perLesson': true},
              {'freq': 2, 'freqUnit': 'week'}, _wq) ==
          null); n++;

  // 4 — מלא ⇒ תוצאת-השקע + נירמול-הארגומנטים
  calls = [];
  final c4 = {'perLesson': true};
  final r4 = enrollmentQuote(c4,
      {'freq': 2, 'freqUnit': 'week', 'term': 'months', 'termMonths': 3, 'tier': '1'}, _wq);
  _chk('דוגמה 4: תוצאה',
      _mapEq(r4 as Map, {'lessons': 8, 'perLesson': 50, 'total': 400})); n++;
  _chk('דוגמה 4: קריאה אחת',
      calls.length == 1 && identical(calls[0][0], c4)); n++;
  _chk('דוגמה 4: ארגומנטים',
      _mapEq(calls[0][1] as Map,
          {'freq': 2, 'unit': 'week', 'term': 'months', 'months': 3, 'tier': '1'})); n++;

  // 5 — בלי tier ⇒ tier:'' · בלי termMonths ⇒ months:null (=undefined ב-JS)
  calls = [];
  enrollmentQuote({'perLesson': true},
      {'freq': 1, 'freqUnit': 'month', 'term': 'year'}, _wq);
  final opts5 = calls[0][1] as Map;
  _chk('דוגמה 5: tier ריק ו-months חסר',
      opts5['tier'] == '' && opts5['months'] == null); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      enrollmentQuote({'perLesson': false}, {'freq': 1, 'freqUnit': 'week', 'term': 'monthly'}, _wq) ==
          null,
      'assert-live guard');

  print('✓ enrollment-quote: $n asserts (5 דוגמאות-חוזה) — Dart≡JS ירוק');
}
