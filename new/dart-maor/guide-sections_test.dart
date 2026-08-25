// בדיקת-חוזה (רתמת-זהב) · guideSections — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה + צילום-הערך, זהות ביט-אחר-ביט למקור-ה-JS
// new/atoms/guide-sections.test.mjs (אותם קלטים→פלטים):
//   1) 9 שורות בדיוק.
//   2) ראשונה: title='בית', בלי module ובלי term ('module' in s === false).
//   3) אחרונה [8]: title='הגדרות', בלי module.
//   4) בדיוק 2 שורות module='families' — 'משפחות'(term='nav.families') + 'כרטיס משפחה'(בלי term).
//   5) 7 שורות עם module · 6 עם term · tzedaka=nav.tzedaka · shop=nav.shop.
//   צילום: אורך-JSON יציב (1140) + נוסח-הלגאסי בשורת-הבית.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/guide-sections_test.dart  ⇒ exit 0
import 'dart:convert';
import 'guide-sections.dart';

void main() {
  var n = 0;
  final g = guideSections;

  // 1) תשע שורות בדיוק.
  assert(g.length == 9, 'FAIL: אורך ${g.length} ≠ 9');
  n++;

  // 2) ראשונה 'בית' בלי module/term — נוכחות-מפתח, לא ערך-null (כלל #2 / JS `in`).
  final first = g[0];
  assert(
    first['title'] == 'בית' && !first.containsKey('module') && !first.containsKey('term'),
    "FAIL: ראשונה 'בית' בלי module/term",
  );
  n++;

  // 3) אחרונה 'הגדרות' בלי module.
  assert(
    g[8]['title'] == 'הגדרות' && !g[8].containsKey('module'),
    "FAIL: אחרונה 'הגדרות' בלי module",
  );
  n++;

  // 4) בדיוק 2 שורות families — 'משפחות'(term) + 'כרטיס משפחה'(בלי term).
  final fams = g.where((s) => s['module'] == 'families').toList();
  assert(fams.length == 2, 'FAIL: בדיוק 2 שורות families, קיבל ${fams.length}');
  n++;
  assert(
    fams[0]['title'] == 'משפחות' && fams[0]['term'] == 'nav.families',
    "FAIL: 'משפחות' עם term='nav.families'",
  );
  n++;
  assert(
    fams[1]['title'] == 'כרטיס משפחה' && !fams[1].containsKey('term'),
    "FAIL: 'כרטיס משפחה' בלי term",
  );
  n++;

  // 5) 7 עם module · 6 עם term · העמודות המבודדות.
  // (truthiness של JS `s.module`: קיים ולא-ריק ⇒ containsKey מספיק, כל הערכים לא-ריקים.)
  assert(g.where((s) => s.containsKey('module')).length == 7, 'FAIL: 7 שורות עם module');
  n++;
  assert(g.where((s) => s.containsKey('term')).length == 6, 'FAIL: 6 שורות עם term');
  n++;
  assert(
    g.firstWhere((s) => s['module'] == 'tzedaka')['term'] == 'nav.tzedaka',
    'FAIL: קופות צדקה = nav.tzedaka',
  );
  n++;
  assert(
    g.firstWhere((s) => s['module'] == 'shop')['term'] == 'nav.shop',
    'FAIL: חנות = nav.shop',
  );
  n++;

  // צילום-ערך (ratchet — נוסח-הלגאסי זהה-ביט): אורך-JSON יציב 1140 (UTF-16 code units,
  // כמו String.length ב-JS; jsonEncode של Dart פולט Unicode-גולמי בסדר-הכנסת-המפתח).
  final json = jsonEncode(g);
  assert(json.length == 1140, 'FAIL: צילום אורך-JSON ${json.length} ≠ 1140');
  n++;
  assert(
    g[0]['text'] == 'תקציר הבוקר, "דורש טיפול" (המשימות שלך), חדרים חיים וגרפים.',
    'FAIL: צילום נוסח-הלגאסי בשורת-הבית',
  );
  n++;

  print('OK guideSections: $n asserts passed');
}
