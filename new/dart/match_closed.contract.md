# חוזה · `matchClosed` (Dart)

מקור-אמת (קדוש, חוק-4): `buildsmart/app_flutter/lib/logic/studio/registry_view.dart:237-260`
(‏`_matchClosed`, private-במקור). קודם לפונקציה top-level ציבורית `matchClosed`.

## חתימה
```dart
String? matchClosed(Set<String> closed, String reply)
```

## קלט
- `closed` — קבוצה-סגורה של מפתחות-אמת (nav ids / action ids / prop keys …).
- `reply` — תשובת-המודל הגולמית (עלולה לעטוף מפתח במרכאות/פרוזה).

## פלט / התנהגות (עוגני-שורה)
- `:238` — `final r = reply.trim()`.
- `:239` — `r.isEmpty ⇒ return null` (fail-closed מוקדם).
- `:243-245` — **מעבר-מדויק ראשון**: קיים `k` עם `r == k` ⇒ מחזיר `k` מיד (short-circuit).
- `:249-256` — **fallback המוכל-הארוך-ביותר**: מבין כל `k` ש-`k.isNotEmpty && r.contains(k)`,
  מחזיר את בעל-האורך-המרבי; קשר ⇒ הראשון-שנסרק זוכה (‏`k.length > best.length` — חמור).
- אין התאמה ⇒ `null`. לעולם לא זורק.

## דוגמאות מספריות
| # | closed | reply | ⇒ | סיבה |
|---|--------|-------|---|------|
| 1 | `{'a','b'}` | `'a'` | `'a'` | התאמה-מדויקת |
| 2 | `{'faucet','kitchenFaucet'}` | `'kitchenFaucet'` | `'kitchenFaucet'` | מדויק גובר על התת-מחרוזת faucet |
| 3 | `{'faucet','kitchenFaucet'}` | `'רוצה kitchenFaucet בבקשה'` | `'kitchenFaucet'` | מוכל-ארוך (12>6) |
| 4 | `{'card','card.order'}` | `'"card.order"'` | `'card.order'` | מוכל-ארוך גובר על prefix |
| 5 | `{'a','b'}` | `'   '` | `null` | ריק אחרי trim |
| 6 | `{'a','b'}` | `'zzz'` | `null` | אין-התאמה |
| 7 | `{'','x'}` | `'y'` | `null` | מפתח-ריק אינו מוכל (‏k.isNotEmpty) |

## שקעים
- אין. `closed` = פרמטר-נתון. `String.trim/contains`, `Set` iteration, `String.length` — שפה/סטנדרט.

## DoD (דיבר 12)
```
dart run --enable-asserts new/dart/match_closed_test.dart  ⇒ exit 0 + "OK matchClosed: N asserts passed"
```
