# חוזה · `galvanicallyDissimilar` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:158-170`
(‏`_galvanicallyDissimilar`). ה-const-האחיות `copperGroup`/`ironGroup` הוטבעו inline verbatim.

## חתימה
```dart
bool galvanicallyDissimilar(Iterable<String> mats)
```

## פלט / התנהגות (עוגני-שורה)
- `install_engine.dart:159` — `const copperGroup = {'נחושת', 'פליז'}`.
- `:160` — `const ironGroup = {'פלדה', 'נירוסטה'}`.
- `:161` — `s = mats.toSet()`.
- `:162-163` — `s.intersection(copperGroup).isNotEmpty && s.intersection(ironGroup).isNotEmpty`.

## דוגמאות מספריות
| # | mats | ⇒ | סיבה |
|---|------|---|------|
| 1 | `['נחושת', 'פלדה']` | `true` | נחושת∩ ∧ פלדה∩ |
| 2 | `['פליז', 'נירוסטה']` | `true` | פליז∈copper ∧ נירוסטה∈iron |
| 3 | `['נחושת', 'פליז']` | `false` | רק copper |
| 4 | `['פלדה', 'נירוסטה']` | `false` | רק iron |
| 5 | `[]` | `false` | ריק |
| 6 | `['PVC', 'HDPE']` | `false` | אף קבוצה |
| 7 | `['נחושת', 'נחושת', 'פלדה']` | `true` | כפילות מכווצת, עדיין דו-קבוצתי |
| 8 | `['נחושת']` | `false` | חסר צד-ברזל |

## שקעים
- אין. `toSet`/`intersection`/`isNotEmpty` — שפה/סטנדרט; הקבוצות const מוטבע.

## DoD
```
dart run --enable-asserts new/dart/galvanically_dissimilar_test.dart  ⇒ exit 0 + "OK galvanicallyDissimilar: N asserts passed"
```
