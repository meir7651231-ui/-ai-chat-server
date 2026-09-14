# חוזה · canonBsp

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/features/fittings/plan/deep_ends.dart:54

## התנהגות
מבטיח את סימן-האינץ' על מידת-BSP (`'1/2'` → `'1/2"'`) — `directMatesWith`
משווה raw-string, וכל ה-BSP הסטטיים נכתבים עם הסימן. בלי הסימן החיבור פשוט
**לא נוצר** (false-negative בטוח, לעולם לא זיווג-שווא) — הנרמול מונע החמצה.

## ייעוד-עברי
מקור: own-doc — מבטיח · את · סימן-האינץ' · על · מידת- · משווה · וכל · ה- · הסטטיים · נכתבים · עם · הסימן

## אימות
בדיקת-Golden (`canon_bsp_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/canon_bsp_test.dart`.
