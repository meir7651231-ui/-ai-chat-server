# חוזה · `directionalContext` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/install_engine.dart:181-189`
(‏`_directionalContext`, פרטי-במקור ⇒ public).

**שקע:** במקור השרשרת היא `List<LipskeyCatalogProduct>` והשם נקרא `chain[k].nameHe`.
מיצוי-השם הומר לשקע `nameOf` (חוק-3), והאטום גנרי על `T`.

## חתימה
```dart
String directionalContext<T>(List<T> chain, int i, {required String Function(T) nameOf})
```

## קלט
- `chain` — השרשרת (List<T>).
- `i` — אינדקס-הפריט הנוכחי.
- `nameOf` — **שקע** (חוק-3): מיצוי-השם-העברי מפריט. במקור `p.nameHe` (‏install_engine.dart:182-183).

## פלט / התנהגות (עוגני-שורה)
- `:182` — `up = i > 0 ? nameOf(chain[i-1]) : null` (שכן-קודם, null בקצה-פתיחה).
- `:183` — `down = i < chain.length-1 ? nameOf(chain[i+1]) : null` (שכן-הבא, null בקצה-סוף).
- `:184` — שניהם ⇒ `'בין "$up" ל-"$down"'`.
- `:185` — רק down ⇒ `'בכניסת הקו (לפני "$down")'`.
- `:186` — רק up ⇒ `'ביציאת הקו (אחרי "$up")'`.
- `:187` — אף אחד (פריט-יחיד) ⇒ `'בקו'`.

## דוגמאות (‏nameOf = זהות על List<String>)
| # | chain | i | ⇒ |
|---|-------|---|---|
| 1 | `['a','b','c']` | 1 | `'בין "a" ל-"c"'` |
| 2 | `['a','b','c']` | 0 | `'בכניסת הקו (לפני "b")'` |
| 3 | `['a','b','c']` | 2 | `'ביציאת הקו (אחרי "b")'` |
| 4 | `['x']` | 0 | `'בקו'` (פריט-יחיד) |
| 5 | `['a','b','c','d']` | 2 | `'בין "b" ל-"d"'` |

## שקעים
- `nameOf` — הזרקת-מיצוי-שם. הבדיקה מזריקה זהות על מחרוזות.

## DoD
```
dart run --enable-asserts new/dart/directional_context_test.dart  ⇒ exit 0 + "OK directionalContext: N asserts passed"
```
