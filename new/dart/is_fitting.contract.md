# חוזה · `isFitting` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:816-851`
(התנהגות-הטיוטה במחצב, דו-סעיפית). ה-const `_fittingCats` הוטבע inline verbatim
(עוגן חי `install_engine.dart:615-621`, אומת). שלושה שקעים (חוק-3/דיבר-9):
`companyCatalogActive` (דגל-state), `categoryHe`/`productType` (שדות p),
`fittingTypes` (ה-const `_fittingTypes` בלתי-בר-שחזור — grep ריק במקור-החי).

## חתימה
```dart
bool isFitting({
  required String categoryHe,
  required String? productType,
  required bool companyCatalogActive,
  required Set<String> fittingTypes,
})
```

## פלט / התנהגות (עוגני-שורה)
- מקור: `_fittingCats.contains(p.categoryHe) || (companyCatalogActive && _fittingTypes.contains(p.productType))`.
- קדימות `||`: קטגוריה-מוכרת מכריעה `true` מיד; אחרת נדרש דגל-פעיל **וגם** סוג-מוכר.

## דוגמאות מספריות
שקע-הבדיקה: `fittingTypes = {'ניפל', 'רקורד'}`.

| # | categoryHe | productType | companyCatalogActive | ⇒ | סיבה |
|---|-----------|-------------|----------------------|---|------|
| 1 | `'ברכיים'` | `null` | `false` | `true` | קטגוריה ∈ _fittingCats |
| 2 | `'צינורות PP'` | `'x'` | `false` | `true` | קטגוריה ∈ _fittingCats |
| 3 | `'ברזים'` | `'ניפל'` | `true` | `true` | דגל+סוג ∈ fittingTypes |
| 4 | `'ברזים'` | `'ניפל'` | `false` | `false` | דגל כבוי |
| 5 | `'ברזים'` | `'מנוע'` | `true` | `false` | סוג ∉ fittingTypes |
| 6 | `'ברזים'` | `null` | `true` | `false` | null ∉ fittingTypes |
| 7 | `'אביזרי נחושת'` | `'מנוע'` | `false` | `true` | קטגוריה גוברת |

## שקעים
- `companyCatalogActive` · `categoryHe` · `productType` · `fittingTypes` — הזרקה (חוק-3/דיבר-9).
- `_fittingCats` — const מוטבע verbatim (עוגן חי).
- `Set.contains` — שפה/סטנדרט.

## DoD
```
dart run --enable-asserts new/dart/is_fitting_test.dart  ⇒ exit 0 + "OK isFitting: N asserts passed"
```
