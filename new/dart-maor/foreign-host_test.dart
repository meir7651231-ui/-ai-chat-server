/// רתמת-זהב · foreign-host — דוגמאות-החוזה מ-new/atoms/foreign-host.test.mjs, ביט-אחר-ביט.
/// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts foreign-host_test.dart
import 'foreign-host.dart';

void main() {
  // 1) מארח זר
  assert(foreignHost('evil.com', ['maor.org']) == true, 'evil.com לא זוהה כזר');
  // 2) מארח רשמי
  assert(foreignHost('maor.org', ['maor.org']) == false, 'maor.org זוהה כזר בטעות');
  // 3) נורמליזציה — www/רישיות/פורט
  assert(foreignHost('www.MAOR.org:8080', ['maor.org']) == false,
      'נורמליזציית www/רישיות/פורט נכשלה');
  // 4) התאמת-סיומת
  assert(foreignHost('org.github.io', ['github.io']) == false,
      'התאמת-סיומת github.io נכשלה');
  // 5) מקומי לעולם לא-זר
  assert(foreignHost('localhost', ['maor.org']) == false, 'localhost זוהה כזר');
  assert(foreignHost('dev.local', ['maor.org']) == false, '*.local זוהה כזר');
  // 6) דורמנטי — אין רשימה
  assert(foreignHost('evil.com', []) == false, 'רשימה ריקה לא דורמנטית');
  assert(foreignHost('evil.com', null) == false, 'null לא דורמנטי');

  print('✓ foreign-host: 6 דוגמאות-חוזה (8 בדיקות) — ירוק');
}
