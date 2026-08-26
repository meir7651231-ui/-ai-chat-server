# חוזה · isFitting

**מוצא:** `buildsmart/app_flutter/lib/logic/install_engine.dart:615-622` (verbatim, חוק-4).
עוגן: `:622` = `bool isFitting(p) => _fittingCats.contains(p.categoryHe);` — סעיף-יחיד.

## חתימה
```dart
bool isFitting(String categoryHe);
```

## קלט
- `categoryHe` — קטגוריית-המוצר בעברית (במקור `p.categoryHe`).

## פלט
`bool` — `_fittingCats.contains(categoryHe)` (16 קטגוריות מחבר/מתאם טהורות, מקור:615-620).

## התנהגות
קטגוריות פטמות/בושינגים/מצמדים/ברכיים/אטמים/קטעי-צינור ⇒ `true` (מותרות למילוי-אוטומטי); התקנים תפקודיים ⇒ `false`.

## דוגמאות (עוגן install_engine.dart:615-622)
| # | categoryHe | פלט |
|---|------------|-----|
| 1 | אביזרי נחושת | true |
| 2 | ברכיים      | true |
| 3 | צינורות PP  | true |
| 4 | אסלות וכיורים | false (קבוע) |
| 5 | חבקי תליה   | false (מבני) |
| 6 | '' (ריק)    | false |
