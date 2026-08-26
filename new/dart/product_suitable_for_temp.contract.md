# חוזה · `productSuitableForTemp` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:65-67`.
השכן `productMaxTempC(p)` (‏install_engine.dart:66, שקע-מועמד בכותרת-הטיוטה) הורם
לשקע-ערך `maxTempC` (חוק-3) — כך נשמט טיפוס-השכן `LipskeyCatalogProduct` (‏`p` שימש
אך-ורק להזנת השכן, install_engine.dart:65-66).

## חתימה
```dart
bool productSuitableForTemp(int tempC, {required int? maxTempC})
```

## קלט
- `tempC` — `int`, טמפרטורת-הקו °C. במקור פרמטר `tempC` (install_engine.dart:65).
- `maxTempC` — **שקע** (חוק-3): `int?`, תוצאת `productMaxTempC(p)` (install_engine.dart:66).
  `null` = אין דירוג-חום (המקור מפרש כ"ללא-הגבלה").

## פלט / התנהגות (עוגני-שורה)
- `install_engine.dart:67` — `return t == null || tempC <= t;`:
  - `maxTempC == null` ⇒ `true` (short-circuit, אין דירוג).
  - אחרת ⇒ `tempC <= maxTempC` (עומד רק אם אינו חורג).

## דוגמאות מספריות
| # | tempC | maxTempC | ⇒ | הסבר |
|---|-------|----------|---|------|
| 1 | 60 | `null` | `true` | אין דירוג ⇒ תמיד עומד |
| 2 | 60 | 90 | `true` | 60 ≤ 90 |
| 3 | 95 | 90 | `false` | 95 > 90 (חורג) |
| 4 | 90 | 90 | `true` | שוויון עומד (`<=`) |
| 5 | 0 | 0 | `true` | 0 ≤ 0 |
| 6 | 1 | 0 | `false` | 1 > 0 |

## עדשה-עוינת
| # | tempC | maxTempC | ⇒ |
|---|-------|----------|---|
| 7 | -10 | `null` | `true` (null גובר לפני השוואה) |
| 8 | -10 | -20 | `false` (-10 > -20) |
| 9 | 1000000 | `null` | `true` |

## שקעים
- `maxTempC` — הזרקת-ערך (חוק-3). הבדיקה מספקת ערכי-דירוג ישירות.

## DoD (פקודה+פלט-צפוי, לפני הקוד — דיבר 12)
```
dart analyze new/dart/product_suitable_for_temp.dart                    ⇒ "No issues found!"
dart run --enable-asserts new/dart/product_suitable_for_temp_test.dart  ⇒ exit 0 + "OK productSuitableForTemp: N asserts passed"
```
