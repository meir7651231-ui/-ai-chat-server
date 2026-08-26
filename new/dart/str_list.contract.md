# חוזה · `strList` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/domain/connection_schema.dart:33-34`
(‏`_strList`, פרטי-במקור — גולגל לאטום top-level; גוף verbatim, הוסרה רק התחילית `_`).

## חתימה
```dart
List<String> strList(Object? v)
```

## קלט
- `v` — ערך גולמי כלשהו (‏Object?), בד"כ תוצאת decode של JSON.

## פלט / התנהגות (עוגני-שורה)
- `connection_schema.dart:34` — `v is List ? v.whereType<String>().toList() : const []`:
  - `v` הוא `List` ⇒ **רק** האיברים שהם `String`, בסדר-הופעה, כ-`List<String>` חדשה.
  - איברים שאינם `String` (‏int/bool/null/Map/List מקונן) ⇒ **מסוננים החוצה**.
  - `v` אינו `List` (‏null, מחרוזת, מספר, Map, …) ⇒ `const []` (רשימה-ריקה).

## דוגמאות מספריות
| # | v | ⇒ |
|---|---|---|
| 1 | `null` | `[]` |
| 2 | `'abc'` (מחרוזת, לא-List) | `[]` |
| 3 | `42` | `[]` |
| 4 | `['x', 'y']` | `['x', 'y']` |
| 5 | `[1, 'a', true, 'b', null]` | `['a', 'b']` (רק המחרוזות) |
| 6 | `[]` | `[]` |
| 7 | `{'k': 'v'}` (Map) | `[]` (Map אינו List) |

## שקעים
- אין. `is List`, `Iterable.whereType`, `.toList()` — dart:core בלבד.

## DoD (פקודה+פלט-צפוי, לפני הקוד — דיבר 12)
```
dart run --enable-asserts new/dart/str_list_test.dart  ⇒ exit 0 + "OK strList: N asserts passed"
```
