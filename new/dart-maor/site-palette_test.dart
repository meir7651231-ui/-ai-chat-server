// בדיקת-חוזה (רתמת-זהב) · sitePalette — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל 6 דוגמאות-החוזה (site-palette.contract.md) ואת בדיקת-ה-JS
// (new/atoms/site-palette.test.mjs) אחת-לאחת:
//   1. '#3B82F6' (כחול) ⇒ משפחה מלאה — 12 שדות + סדר-מפתחות (סריאליזציה
//      תלוית-סדר, שקילות-JSON.stringify — כלל-14).
//   2. '#f00' (hex מקוצר) ⇒ 3 ספרות נפרשות ל-6 (c2/rgb2).
//   3. '#888888' (אפור, רוויה 0) ⇒ הרוויה נחסמת מלמטה ל-0.42 סביב hue 0 (c2/ink).
//   4–6. undefined / 'xyz' / '   ' ⇒ פלטת-הנפילה עצמה (identical — שקילות ===).
// השוואת-מפה = מפתח-אחר-מפתח + סדר (עקרון כלל-8: אורך+איבר-איבר, לא join עיוור).
// כשל ⇒ StateError. הרצה:
//   dart run --enable-asserts new/dart-maor/site-palette_test.dart  ⇒ OK
import 'site-palette.dart';

// שחזור JSON.stringify תלוי-סדר-הכנסה למפת-מחרוזות פשוטה (ערכי hex/"r,g,b" —
// בלי תווים הדורשים escaping).
String _stringify(Map m) {
  final parts = <String>[];
  m.forEach((k, v) => parts.add('"$k":"$v"'));
  return '{' + parts.join(',') + '}';
}

void _fail(String msg) => throw StateError('FAIL: $msg');

// השוואת-מפה נאמנת-כלל-8: אותם מפתחות באותו סדר + ערך-אחר-ערך.
void _eqMap(String name, dynamic got, Map<String, String> want) {
  if (got is! Map) _fail('$name: לא מפה — $got');
  final gk = (got as Map).keys.toList(), wk = want.keys.toList();
  if (gk.length != wk.length) {
    _fail('$name: ${gk.length} מפתחות ≠ ${wk.length}');
  }
  for (var i = 0; i < wk.length; i++) {
    if (gk[i] != wk[i]) _fail('$name: מפתח[$i] ${gk[i]} ≠ ${wk[i]}');
    final k = wk[i];
    if (got[k] != want[k]) _fail('$name.$k: ${got[k]} ≠ ${want[k]}');
  }
  // וגם שקילות-הסריאליזציה המלאה (בדיקת-ה-JS משווה JSON.stringify)
  if (_stringify(got) != _stringify(want)) {
    _fail('$name: stringify ≠\n got =${_stringify(got)}\n want=${_stringify(want)}');
  }
}

void main() {
  var n = 0;
  // שקע-נתונים: פלטת-נפילה (במקור CORAL_PALETTE; לבדיקת-הזהות מספיק אובייקט-עד)
  final fb = {'c1': '#EC9C9C', 'c2': '#D97F7F'};

  // — דוגמה 1: כחול — משפחה מלאה (12 שדות, סדר-הליטרל של המקור) —
  _eqMap("'#3B82F6'", sitePalette('#3B82F6', fb), {
    'c1': '#8db3f2',
    'c2': '#4b8af1',
    'c3': '#0d5ee3',
    'word': '#6299f3',
    'ink': '#212730',
    'paper': '#fafbfd',
    'cream': '#eef2f9',
    'blush': '#f1f5fc',
    'marquee': '#d9e2f2',
    'rgb1': '141,179,242',
    'rgb2': '75,138,241',
    'inkRgb': '33,39,48',
  });
  n++;

  // — דוגמה 2: hex מקוצר #f00 נפרש ל-6 ספרות —
  {
    final p = sitePalette('#f00', fb);
    if (p['c2'] != '#f14b4b') _fail("'#f00'.c2 = ${p['c2']} ≠ #f14b4b");
    if (p['rgb2'] != '241,75,75') _fail("'#f00'.rgb2 = ${p['rgb2']} ≠ 241,75,75");
    n++;
  }

  // — דוגמה 3: אפור (רוויה 0) — נחסם מלמטה ל-0.42 סביב hue 0 (נאמן-למקור) —
  {
    final p = sitePalette('#888888', fb);
    if (p['c2'] != '#c77575') _fail("'#888888'.c2 = ${p['c2']} ≠ #c77575");
    if (p['ink'] != '#302121') _fail("'#888888'.ink = ${p['ink']} ≠ #302121");
    n++;
  }

  // — דוגמאות 4–6: נפילה ביט-זהה (אותה הפניה — === של JS ⇒ identical של Dart) —
  if (!identical(sitePalette(null, fb), fb)) {
    _fail('undefined לא החזיר את פלטת-הנפילה עצמה');
  }
  n++;
  if (!identical(sitePalette('xyz', fb), fb)) {
    _fail("'xyz' לא החזיר את פלטת-הנפילה עצמה");
  }
  n++;
  if (!identical(sitePalette('   ', fb), fb)) {
    _fail("'   ' לא החזיר את פלטת-הנפילה עצמה");
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sitePalette('#3B82F6', fb)['c2'] == '#4b8af1', 'assert-live guard');

  if (n != 6) _fail('צפו 6 דוגמאות-חוזה, רצו $n');
  print('OK sitePalette: $n דוגמאות-חוזה — ירוק');
}
