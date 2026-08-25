// בדיקת-חוזה (רתמת-זהב) · defaultFavicon — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/default-favicon.test.mjs.
// אם עובר ⇒ Dart≡JS (הערך המלא ביט-זהה).
// הרצה: dart run --enable-asserts new/dart-maor/default-favicon_test.dart  ⇒ exit 0
import 'default-favicon.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: ' + msg);
}

void main() {
  final f = defaultFavicon;

  // 1 — מתחיל ב-data:image/svg+xml,
  _ok(f.startsWith('data:image/svg+xml,'), 'לא מתחיל ב-data:image/svg+xml,');
  // 2 — viewBox 0 0 100 100
  _ok(f.contains("viewBox='0 0 100 100'"), 'אין viewBox 0 0 100 100');
  // 3 — מילוי-זהב + מילוי-חום
  _ok(f.contains('%23f3c76b') && f.contains('%23b45309'), 'חסר מילוי-זהב/חום');
  // 4 — בדיוק 2 עיגולים
  _ok(f.split('<circle').length - 1 == 2, 'לא בדיוק 2 עיגולים');
  // 5 — רדיוסים 38/20
  _ok(f.contains("r='38'") && f.contains("r='20'"), 'רדיוסים 38/20 חסרים');
  // 6 — הערך המלא ביט-זהה
  _ok(
      f ==
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='38' fill='%23f3c76b'/><circle cx='50' cy='50' r='20' fill='%23b45309'/></svg>",
      'הערך המלא לא ביט-זהה');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(f.startsWith('data:image/svg+xml,'), 'assert-live guard');

  print('OK defaultFavicon: 6 דוגמאות-חוזה — ירוק');
}
