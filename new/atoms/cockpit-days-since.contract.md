# חוזה · cockpit-days-since

**תפקיד:** ימים בין תאריך-ISO ליום-הייחוס (חיובי = בעבר, שלילי = עתיד). `Infinity` לתאריך ריק או לא-תקין.

**מוצא:** `maor-system/src/components/supporters/cockpit.ts:42` (`daysSince`) + `MS_DAY` (שורה 39) הוטבע inline. חוק-4: התנהגות verbatim.

**חתימה:** `cockpitDaysSince(iso: string, todayIso: string) => number`

**שקעים (deps):** אין — אטום טהור עצמאי (רק `Date`/`Math`/`Number` מ-dart:core-שקול).

**סמנטיקה:**
- `iso` ריק/נפילת-falsy ⇒ `Infinity`.
- פרסור עם `T12:00:00` (צהריים מקומי — נמנע מהיסט DST), הפרש במילישניות חלקי 86,400,000, `Math.floor`.
- אחד מהתאריכים לא-תקין (`NaN`) ⇒ `Infinity`.

**דוגמאות מחייבות:**
| iso | todayIso | ⇒ |
|---|---|---|
| `''` | `''` | `Infinity` |
| `2026-08-20` | `2026-08-26` | `6` |
| `2026-08-27` | `2026-08-26` | `-1` |
| `2024-02-28` | `2024-03-01` | `2` (שנה מעוברת) |
| `bad` | `2026-08-26` | `Infinity` |

**הערת-המרה (Dart):** `Infinity` ⇒ `double.infinity`; `Math.floor` ⇒ `.floorToDouble()`/`floor()`; פרסור-תאריך ⇒ `DateTime.parse(iso + 'T12:00:00')` עם טיפול-שגיאה שמחזיר infinity (מקביל ל-NaN-guard). אימות-עוין מול Node.
