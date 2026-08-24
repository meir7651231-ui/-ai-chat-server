// בדיקת-חוזה (רתמת-זהב) · allOffConfig — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/all-off-config.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/all-off-config_test.dart  ⇒ exit 0
// אפס import של dart:convert — ה-JSON נבנה ידנית מסדר-ההכנסה (מדמה JSON.stringify של הדאטה הזה).
import 'all-off-config.dart';

// — סריאליזציה זהה ל-JSON.stringify עבור הדאטה הזה: String / bool / int / Map מקוננת,
//   סדר-הכנסה נשמר. תווי-עברית נשארים כלשונם (כמו JSON.stringify). —
String _stringify(dynamic v) {
  if (v is String) {
    final esc = v.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    return '"$esc"';
  }
  if (v is bool) return v ? 'true' : 'false';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('${_stringify(k as String)}:${_stringify(val)}'));
    return '{${parts.join(',')}}';
  }
  if (v is num) return v.toString();
  throw StateError('unsupported type: ${v.runtimeType}');
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — דוגמה 1: דוגמת-הליבה (זהה ל-test.mjs #1) —
  final out1 = allOffConfig('demo', 'מאור', ['a', 'b'], {'theme': 'x'});
  const snap1 =
      '{"theme":"x","slug":"demo","orgName":"מאור",'
      '"modules":{"a":false,"b":false},"features":{},"terms":{}}';
  _eq(_stringify(out1), snap1, 'דוגמה 1 — דוגמת-הליבה'); n++;

  // — דוגמה 2: false מפורש (לא null/חסר) —
  if (out1['modules']['a'] != false) {
    throw StateError('FAIL: modules.a אינו false מפורש');
  }
  n++;

  // — דוגמה 3: דריסת-בסיס (slug/modules/features נדרסים במקומם) —
  final base3 = {
    'slug': 'default',
    'modules': {'a': true},
    'features': {'f': 1},
  };
  final out3 = allOffConfig('s1', 'שם', ['a'], base3);
  if (out3['slug'] != 's1' ||
      out3['modules']['a'] != false ||
      _stringify(out3['features']) != '{}') {
    throw StateError('FAIL: דריסת-הבסיס נכשלה: ${_stringify(out3)}');
  }
  n++;
  // סדר-המפתחות: slug,modules,features נשמרים במיקום-הבסיס; orgName,terms מתווספים בסוף.
  _eq(
    _stringify(out3),
    '{"slug":"s1","modules":{"a":false},"features":{},"orgName":"שם","terms":{}}',
    'דוגמה 3 — סדר-דריסה',
  );
  n++;

  // — דוגמה 4: 9 מפתחות maor — כולם false —
  const mods = [
    'families', 'courses', 'calendar', 'diary', 'supporters',
    'reports', 'tzedaka', 'shop', 'shop7',
  ];
  final out4 = allOffConfig('s', 'x', mods, {});
  final modules4 = out4['modules'] as Map<String, bool>;
  if (modules4.length != 9 || modules4.values.any((v) => v != false)) {
    throw StateError('FAIL: 9 המודולים אינם כולם false');
  }
  _eq(modules4.keys.join(','), mods.join(','), 'דוגמה 4 — סדר 9 המודולים'); n++;

  // — דוגמה 5: טוהר — הבסיס לא שונה, הפלט רפרנס חדשה —
  _eq(
    _stringify(base3),
    '{"slug":"default","modules":{"a":true},"features":{"f":1}}',
    'דוגמה 5 — defaultConfig לא עבר מוטציה',
  );
  n++;
  if (identical(out3, base3)) {
    throw StateError('FAIL: הפלט הוא אותה רפרנס כמו הבסיס');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_stringify(out1) == snap1, 'assert-live guard');

  print('OK allOffConfig: $n asserts passed — 5 דוגמאות-חוזה ירוק');
}
