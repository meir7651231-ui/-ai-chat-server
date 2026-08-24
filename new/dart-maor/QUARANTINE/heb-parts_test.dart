// רתמת-הזהב · heb-parts — assert-ים = בדיוק דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/heb-parts.test.mjs). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts heb-parts_test.dart  ⇒  exit 0.
import 'heb-parts.dart';

void main() {
  // י"א אלול תשפ"ו — עוגן 2026-08-24
  final p1 = hebParts(DateTime(2026, 8, 24, 12, 0, 0));
  assert(p1['day'] == 11 && p1['month'] == 'Elul' && p1['year'] == 5786,
      'אלול: $p1');

  // ט"ו ניסן (פסח) — 2026-04-02
  final p2 = hebParts(DateTime(2026, 4, 2, 12, 0, 0));
  assert(p2['day'] == 15 && p2['month'] == 'Nisan', 'פסח: $p2');

  // אדר-ב מעוברת (פורים) — 2024-03-24
  final p3 = hebParts(DateTime(2024, 3, 24, 12, 0, 0));
  assert(p3['month'] == 'Adar II', 'אדר-ב מעוברת: $p3');

  // מגן-שבור: קלט לא-חוקי (null = Invalid Date) ⇒ חלקים בטוחים
  final p4 = hebParts(null);
  assert(p4['day'] == 0 && p4['month'] == '', 'מגן-שבור: $p4');

  print('✓ heb-parts (Dart): 3 תאריכי-עוגן + מגן-שבור מאומתים — Dart ≡ JS');
}
