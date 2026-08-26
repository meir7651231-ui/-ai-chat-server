# חוזה · `flowRole` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:479-494`
(‏`flowRole`). ה-enum `FlowRole` (accessory/fixture/connector) הוטבע inline verbatim
(חוק-1). הקלט `LipskeyCatalogProduct` צומצם לשדות `sku`+`categoryHe` (חוק-3/6). חמש
קבוצות-הסיווג הפכו לשקעים (חוק-3 — דאטה מוזרקת בקופסה).

## חתימה
```dart
enum FlowRole { accessory, fixture, connector }

FlowRole flowRole(String sku, String categoryHe, {
  required Set<String> accessorySkus,
  required Set<String> hotWaterAccessorySkus,
  required Set<String> structuralCats,
  required Set<String> fixtureCats,
  required Set<String> terminalCats,
})
```

## קלט
- `sku`, `categoryHe` — במקור `p.sku` / `p.categoryHe`.
- 5 שקעי-`Set<String>` — במקור const-ים (`_accessorySkus`, `kHotWaterAccessorySkus`,
  `_structuralCats`, `_fixtureCats`, `_terminalCats`).

## פלט / התנהגות (עוגני-שורה) — קסקדה, הסדר קדוש
1. `install_engine.dart:480-481` — `accessorySkus.contains(sku) || hotWaterAccessorySkus.contains(sku)`
   ⇒ `FlowRole.accessory` (בדיקת-sku ראשונה, גוברת).
2. `install_engine.dart:483` — `structuralCats.contains(categoryHe)` ⇒ `FlowRole.accessory`.
3. `install_engine.dart:486-488` — `fixtureCats.contains(c) || terminalCats.contains(c)`
   ⇒ `FlowRole.fixture`.
4. `install_engine.dart:490` — אחרת ⇒ `FlowRole.connector`.

## דוגמאות מספריות
שקעים לבדיקה: `accessorySkus={A1}`, `hotWaterAccessorySkus={HW1}`,
`structuralCats={'תמיכה'}`, `fixtureCats={'אסלות וכיורים'}`, `terminalCats={'סיפונים'}`.

| # | sku | categoryHe | ⇒ | נימוק |
|---|-----|-----------|---|-------|
| 1 | `'A1'` | `'סיפונים'` | accessory | sku ב-accessorySkus (גובר על terminal) |
| 2 | `'HW1'` | `'אסלות וכיורים'` | accessory | sku ב-hotWater (גובר על fixture) |
| 3 | `'X'` | `'תמיכה'` | accessory | structuralCat |
| 4 | `'X'` | `'אסלות וכיורים'` | fixture | fixtureCat |
| 5 | `'X'` | `'סיפונים'` | fixture | terminalCat |
| 6 | `'X'` | `'מחברי HDPE'` | connector | אף קבוצה ⇒ ברירת-מחדל |

## שקעים
- 5 קבוצות-הסיווג — הזרקת-דאטה (חוק-3/5). הבדיקה מזריקה קבוצות סינתטיות מינימליות
  המדגימות כל ענף-קסקדה + את קדימות-ה-sku על הקטגוריה.

## DoD (פקודה+פלט-צפוי — דיבר 12)
```
dart run --enable-asserts new/dart/flow_role_test.dart  ⇒ exit 0 + "OK flowRole: N asserts passed"
```
