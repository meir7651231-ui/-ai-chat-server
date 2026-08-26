# חוזה · `isDirectionalDevice` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:171-180`
(‏`_isDirectionalDevice`). `p.categoryHe`/`p.nameHe` קופלו לשקעי-מחרוזת (חוק-3;
LipskeyCatalogProduct טיפוס-שכן גדול, לא-inline).

## חתימה
```dart
bool isDirectionalDevice({required String categoryHe, required String nameHe})
```

## פלט / התנהגות (עוגני-שורה)
- `:172` — `categoryHe == 'אל חזור' ⇒ true` (קיצור-דרך מיידי).
- `:173` — `n = nameHe.replaceAll('-', '').replaceAll(' ', '')` (הסרת מקפים ורווחים).
- `:174` — `n.contains('אלחזור') || n.contains('אלחוזר')`.

## דוגמאות מספריות
| # | categoryHe | nameHe | ⇒ | סיבה |
|---|-----------|--------|---|------|
| 1 | `'אל חזור'` | `''` | `true` | קטגוריה (‏:172) |
| 2 | `'ברזים'` | `'שסתום אל-חזור'` | `true` | 'אל-חזור'→'אלחזור' לאחר-נרמול |
| 3 | `'ברזים'` | `'אל חוזר קפיצי'` | `true` | 'אל חוזר'→'אלחוזר' |
| 4 | `'ברזים'` | `'ברז כדורי'` | `false` | לא-קטגוריה ולא-שם |
| 5 | `'אל חזור '` (רווח-נספח) | `'x'` | `false` | קטגוריה != התאמה-מדויקת; שם לא-מכיל |
| 6 | `'ברזים'` | `'א-ל-ח-ז-ו-ר'` | `true` | מקפים מוסרים ⇒ 'אלחזור' |
| 7 | `'ברזים'` | `'אלחוזר'` | `true` | ישיר |

## שקעים
- `categoryHe` · `nameHe` — הזרקת-שדות (חוק-3).
- `String.replaceAll`, `String.contains` — שפה/סטנדרט.

## DoD
```
dart run --enable-asserts new/dart/is_directional_device_test.dart  ⇒ exit 0 + "OK isDirectionalDevice: N asserts passed"
```
