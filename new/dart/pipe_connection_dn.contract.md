# חוזה · `pipeConnectionDn` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:596-605`
(‏`pipeConnectionDn`). מוצא את מידת-החיבור (DN) הראשונה שבה שני מוצרים מתחברים ישירות.

## הטבעה/שקעים
- `kVerifiedSpecs[a.sku]`/`[b.sku]` (const-קטלוג ענק) ⇒ **סוקט** ע"י הזרקת
  `endsA`/`endsB`. מפרט-חסר במקור (⇒ null) ≡ רשימה-ריקה כאן (⇒ null).
- `eA.pipeSharedWith(eB)` (מתודת-קצה) ⇒ **שקע** `pipeShared` (חוק-3).
- `eA.size` (שדה-קצה) ⇒ **שקע** `sizeOf` (חוק-3).
- טיפוס-הקצה `E` ⇒ **גנרי** (חוק-1).

## חתימה
```dart
String? pipeConnectionDn<E>(List<E> endsA, List<E> endsB, {required bool Function(E,E) pipeShared, required String Function(E) sizeOf})
```

## התנהגות (עוגני-שורה)
- `install_engine.dart:597-598` — מפרט-חסר ⇒ `null` (כאן: רשימה ריקה ⇒ אין איטרציה).
- `:599-603` — לולאה מקוננת: לכל `eA` (חיצונית), לכל `eB` (פנימית); התאמה ראשונה
  ‏(`pipeShared`) ⇒ מחזיר `sizeOf(eA)`. הסדר: הקצה-A הראשון (בסדר-הרשימה) שמוצא
  שותף כלשהו ב-B מנצח.
- `:604` — אין התאמה ⇒ `null`.

## דוגמאות (‏pipeShared: שוויון · sizeOf: זהות — E=String של המידה)
| # | endsA | endsB | ⇒ |
|---|-------|-------|---|
| 1 | `['32']` | `['32']` | `'32'` |
| 2 | `['32','40']` | `['40']` | `'40'` (A[0] לא, A[1] כן) |
| 3 | `[]` | `['32']` | `null` (אין מפרט-A) |
| 4 | `['32']` | `[]` | `null` (אין מפרט-B) |
| 5 | `['50']` | `['32']` | `null` (אין חיבור משותף) |
| 6 | `['32','40']` | `['40','32']` | `'32'` (A[0] מוצא שותף) |
| 7 | `['32','32']` | `['32']` | `'32'` |

## DoD (דיבר 12)
```
dart run --enable-asserts new/dart/pipe_connection_dn_test.dart  ⇒ exit 0 + "OK pipeConnectionDn: N asserts passed"
```
