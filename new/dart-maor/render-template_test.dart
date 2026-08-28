// בדיקת-חוזה (רתמת-זהב) · renderTemplate — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/render-template.test.mjs.
// הרצה: dart run --enable-asserts new/dart-maor/render-template_test.dart  ⇒ exit 0
import 'render-template.dart';

void main() {
  var n = 0;
  final defs = <Map<String, String>>[
    {'key': 'wa.delivery', 'def': 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚'},
  ];
  void eq(String got, String want, String msg) {
    if (got != want) {
      throw StateError('FAIL $msg\n got =$got\n want=$want');
    }
    n++;
  }

  // 1) בלי דריסה — ברירת-מחדל + החלפת-משתנים
  eq(renderTemplate(null, 'wa.delivery', {'name': 'רחל', 'org': 'מאור'}, defs),
      'שלום רחל, משלוח ממאור בדרך אליכם היום 🚚', 'ex1 ברירת-מחדל');

  // 2) דריסת-ארגון גוברת
  eq(
      renderTemplate(<String, dynamic>{
        'templates': {'wa.delivery': 'היי {name}!'}
      }, 'wa.delivery', {'name': 'דנה'}, defs),
      'היי דנה!',
      'ex2 דריסת-ארגון');

  // 3) דריסה ריקה/רווחים ⇒ ברירת-המחדל (trim לפני ההכרעה)
  eq(
      renderTemplate(<String, dynamic>{
        'templates': {'wa.delivery': '  '}
      }, 'wa.delivery', {'name': 'רחל', 'org': 'מאור'}, defs),
      'שלום רחל, משלוח ממאור בדרך אליכם היום 🚚',
      'ex3 דריסה-ריקה');

  // 4) משתנה לא-מסופק נשאר כפי-שהוא
  eq(renderTemplate(null, 'wa.delivery', {'name': 'רחל'}, defs),
      'שלום רחל, משלוח מ{org} בדרך אליכם היום 🚚', 'ex4 משתנה-חסר');

  // 5) מפתח לא-מוכר ⇒ ''
  eq(renderTemplate(null, 'wa.none', {'x': '1'}, defs), '', 'ex5 מפתח-לא-מוכר');

  // 6) כל המופעים מוחלפים
  eq(
      renderTemplate(<String, dynamic>{
        'templates': {'wa.delivery': '{name} {name}'}
      }, 'wa.delivery', {'name': 'אב'}, defs),
      'אב אב',
      'ex6 כל-המופעים');

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל
  assert(renderTemplate(null, 'wa.none', <String, String>{}, defs) == '',
      'assert-live guard');

  print('OK renderTemplate: $n asserts passed');
}
