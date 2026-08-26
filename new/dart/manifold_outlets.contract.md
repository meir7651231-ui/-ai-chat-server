# חוזה · `manifoldOutlets` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:1471-1487`
(‏`manifoldOutlets`).

## הטבעת/סיקוט-שכנים (שקיפות)
- `LipskeyCatalogProduct p` — טיפוס-מוצר גדול; המקור סורק ממנו **רק** `productType`, `categoryHe`, `sku`.
  הוטבע כרשומה `({String productType, String categoryHe, String sku})` (חוק-2, מינימום-הנדרש verbatim).
- `kVerifiedSpecs` — מפת-מפרטים גדולה (‏sku ⇒ spec); קופלה לשקע-נתון `specs` (חוק-3). ערך-המפרט
  הוא רשומה `({List<({String size})> ends})` — המקור נוגע רק ב-`spec.ends` וב-`e.size`.

## חתימה
```dart
int manifoldOutlets(
  ({String productType, String categoryHe, String sku}) p, {
  required Map<String, ({List<({String size})> ends})> specs,
})
```

## פלט / התנהגות (עוגני-שורה)
- `:1476` — **שער-טקסונומיה**: אם `productType != 'מחלק' && categoryHe != 'מחלקים'` ⇒ `0`
  (מסעף עם 3+ קצוות זהים אינו-מחלק ⇒ 0).
- `:1477-1478` — `spec = specs[sku]`; אם `spec == null || spec.ends.length < 3` ⇒ `0`.
- `:1479-1482` — סופר כמה קצוות לכל `size` (‏`counts[size]++`).
- `:1483` — `maxc = counts.values.fold(0, max)` (הגודל-הנפוץ-ביותר).
- `:1484` — `maxc >= 2 ? maxc : 0` (מחלק חייב ≥2 מוצאים באותו גודל).

## דוגמאות מספריות
| # | p | spec.ends (sizes) | ⇒ | סיבה |
|---|---|-------------------|---|------|
| 1 | productType='מחלק', sku='M4' | 4×DN20 | `4` | 4 מוצאים זהים |
| 2 | productType='X', categoryHe='מחלקים', sku='M3' | DN20,DN20,DN25 | `2` | maxc=2 (‏DN20) ≥2 |
| 3 | productType='מסעף', categoryHe='מסעפים', sku='116565' | 3×DN50 | `0` | שער-טקסונומיה חוסם (אינו-מחלק) |
| 4 | productType='מחלק', sku='M2' | DN20,DN20 | `0` | ‏ends.length<3 |
| 5 | productType='מחלק', sku='MISSING' | (אין ב-specs) | `0` | ‏spec==null |
| 6 | productType='מחלק', sku='M3d' | DN20,DN25,DN32 | `0` | maxc=1 (<2) |

## שקעים
- `specs` — הזרקת-מפה (חוק-3, בגלל `kVerifiedSpecs` הגדולה). הבדיקה מספקת מפרטים דטרמיניסטיים.
- `p` — רשומה מינימלית (הטבעת-שכן verbatim).

## DoD (דיבר 12)
```
dart run --enable-asserts new/dart/manifold_outlets_test.dart  ⇒ exit 0 + "OK manifoldOutlets: N asserts passed"
```
