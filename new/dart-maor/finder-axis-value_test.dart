// בדיקת-חוזה (רתמת-זהב) · finderAxisValue — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/finder-axis-value.test.mjs
// (אותם קלטים→פלטים; אותם שקעי-ייחוס, הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/finder-axis-value_test.dart  ⇒ exit 0
import 'finder-axis-value.dart';

// — שקעי-הייחוס כמוסכמת-maor (מקומיים לבדיקה, מקבילים למימושי-ה-JS) —
final Map<String, dynamic> STATUS_META = {
  'active': {'label': 'פעילה'},
  'pending': {'label': 'ממתינה'},
  'inactive': {'label': 'לא פעילה'},
};

Map<String, dynamic> tierOf(num score) {
  if (score >= 950) return {'label': 'טיטאן'};
  if (score >= 800) return {'label': 'לביאה'};
  if (score >= 500) return {'label': 'טעון שיפור'};
  return {'label': 'סיכון נטישה'};
}

final Map<String, String> _dict = {'nav.courses': 'שיעורים'};
String termOf(dynamic c, String k, String fb) => _dict[k] ?? fb;

List<dynamic> _liveList = [];
List<dynamic> famLiveEnrollments(dynamic db, Map<String, dynamic> f) => _liveList;

final Map<String, dynamic> _db = {};
final Map<String, dynamic> _base = {'status': 'active', 'members': <dynamic>[]};

// V — ממזג base+fam (כמו {...base, ...fam} במקור) וקורא לאטום עם השקעים.
// config אופציונלי: היעדרו (null) = undefined של JS (⇒ fallback); {} = truthy (⇒ termOf).
String V(Map<String, dynamic> fam, String axis, [dynamic config]) =>
    finderAxisValue(
      _db,
      {..._base, ...fam},
      axis,
      config,
      termOf: termOf,
      tierOf: tierOf,
      famLiveEnrollments: famLiveEnrollments,
      STATUS_META: STATUS_META,
    );

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) city
  _ok(V({'city': 'צפת'}, 'city') == 'צפת', "דוגמה 1: city ≠ 'צפת'");
  n++;
  _ok(V({}, 'city') == '', "דוגמה 1: city חסר ≠ ''");
  n++;

  // 2) marital חסר
  _ok(V({}, 'marital') == 'לא ידוע', "דוגמה 2: marital חסר ≠ 'לא ידוע'");
  n++;

  // 3) status דרך STATUS_META
  _ok(V({'status': 'active'}, 'status') == 'פעילה', "דוגמה 3: status ≠ 'פעילה'");
  n++;

  // 4) cred — ברירת-מחדל 700 · ציון 960
  _ok(V({}, 'cred') == 'טעון שיפור', "דוגמה 4: cred חסר ≠ 'טעון שיפור'");
  n++;
  _ok(V({'cred': {'score': 960}}, 'cred') == 'טיטאן',
      "דוגמה 4: score=960 ≠ 'טיטאן'");
  n++;

  // 5) kids
  _ok(
      V({'members': [{'isParent': true}, {'isParent': false}]}, 'kids') ==
          'עם ילדים',
      'דוגמה 5: עם ילדים');
  n++;
  _ok(V({'members': [{'isParent': true}]}, 'kids') == 'בלי ילדים',
      'דוגמה 5: בלי ילדים');
  n++;

  // 6) enrolled — עם/בלי config, עם/בלי שיבוץ-חי
  _liveList = [{'id': 'e1'}];
  _ok(V({}, 'enrolled') == 'משתתפות בחוגים',
      'דוגמה 6: בלי config ≠ משתתפות בחוגים');
  n++;
  _ok(V({}, 'enrolled', {}) == 'משתתפות בשיעורים',
      'דוגמה 6: עם מילון ≠ משתתפות בשיעורים');
  n++;
  _liveList = [];
  _ok(V({}, 'enrolled', {}) == 'לא משתתפות',
      "דוגמה 6: אין שיבוץ ≠ 'לא משתתפות'");
  n++;

  // 7) ציר לא-מוכר
  _ok(V({}, 'foo') == '', "דוגמה 7: ציר-זר ≠ ''");
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(V({'city': 'צפת'}, 'city') == 'צפת', 'assert-live guard');

  print('OK finderAxisValue: $n asserts passed');
}
