# CLOSED · GENMAX G40 — ×100 בדרך-החלקיקים: מקבץ ב׳-קכב…קכה (9.9.2026 לילה · לפי הכרעה-30)

> אפס צורך חדש, אפס אטום חדש. הרכבות: `bhWeekRange` (`startOfWeekSunday`+`addDaysIso`) · `bhInRange` (`inRange`); שימוש-חוזר: `bhPrefixRest` (`rulePrefix`) · `bhDigitsQuery` · `bhGroupRows` (`countBy`) · `bhDaysSince`. **דקדוק** (לא דומיין) ב-`spec-lang.data.json`: `weekWords` · `amountAbove` · `amountBelow`.

## 1 · מה המשתמש רואה
- **ב׳-קכב · «שבוע הבא» ⇒ מסך-שבוע** — לבד בשורה-המהירה או בחיפוש (גם «השבוע» · «שבוע שעבר»): `BalaganWeek` ראשון–שבת, כל התיקים לפי יום (`balaganRangeItems` על `bhInRange`), כותרת-משנה «13.9 – 19.9». צילומים: `show2/85` (צ׳יפ) · `show2/86` (המסך).
- **ב׳-קכג · «מעל 5000» / «פחות מ-300»** — קטע-תוצאות לפי שדה-הכסף-הראשי, ממוין-יורד (`balaganAmountFilter` דרך `bhPrefixRest` — השער ג׳ תפס `startsWith` ידני והוחלף בחלקיק; `balaganAmountItems`).
- **ב׳-קכד · «סיימתי היום:»** — «שתף את היום» מוסיף את שורות-ה-'done' של היום מהיומן.
- **ב׳-קכה · «דחית 3 פעמים»** — על שורות היום/באיחור כשהתיק נדחה ≥3 (`balaganSnoozeCounts` על רשומות-'auto' של דחייה, `bhGroupRows`).

## 2 · שני חורים שנסגרו בדרך
1. **המחולל קרס בשקט והלולאה "עברה"** — `node balagan.mjs | tail -1` בלע את קוד-היציאה; הקבצים-הישנים נבדקו וקיבלו ירוק (88 בדיקות "עברו" בלי הבדיקה החדשה). `wave.sh`: `set -o pipefail`. הסימן שתפס: מונה-הבדיקות לא עלה.
2. תבניות-הקבצים של המחולל אינן שוות-היקף: ל-`moments` ולתבנית-הבדיקה אין `k` (מחרוזות-כרום) — עוזר שצריך `k`/`balaganFmtMoney` יושב בתבנית-הבית; בבדיקה: `dq(L.x)`.

## 3 · הוכחה
`behavior` 24/24 · `gen_behaviors_test` 7/7 · `balagan_facts_test` 81/81 (חדש: ב׳-קכב/קכג/קכה) · analyze 0 · build · `balagan` 35/36 · `balaganrun` 2·1.
