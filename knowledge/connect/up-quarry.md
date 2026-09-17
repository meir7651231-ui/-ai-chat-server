# up-quarry — חלקיק שחסר במדף: הקרצף חוצב צבירה (sumBy) · הרתמה מקלידה למבדה לפי השקע

הוראת-הבעלים: "לא קיים ≠ לא אפשרי — תמשיך" (20:55). ההקשר: המטרה "תשלומי הורים באיחור" — המדד «כמה חייבים בסך הכל» נשאר ∅ בהוכחה-בריצה (up-compose). ענף claude/up-connect-260917. כל מספר עם פקודה; DART=/root/dart-sdk/bin/dart.

## הפער שנמדד
- במדף אין צבירה גנרית: `ls new/atoms | grep -iE "sum|total"` ⇒ רק boq-total · box-total · campaign-total · coordinator-total · grand-total — חמישה סכומים דומייניים (שדה `amount` צרוב, מבנה צרוב), **אותו גרעין** Σ.
- הקרצף (`dart run ast_carve.dart --ops box-total.dart boxTotal`) חצב מ-boxTotal חלקיק אחד בלבד: `fieldOf`. לולאת-צבירה (`for … total += …`) ו-`fold`/`reduce` לא היו תבניות שהוא מכיר.
- ממצא-אגב: `machtzev/carve/ast_carve.dart` **בריפו היה מאחורי** העותק ב-scratchpad/carve-run (fieldOf · fieldPred · addTo נחתו כחלקיקים בלי שהמנוע שחצב אותם נקמט). אוחד: הריפו הוא המקור, העותק בתיקיית-הריצה זהה.

## מה שודרג (מנועים קיימים)
1. **ast_carve.dart --ops** — תבניות חדשות: `for (x in xs) { … acc += E(x) }` ⇒ `sumBy(List<dynamic>, num Function(dynamic)) => num` (E = שקע-פונקציה, חוק-3); `.fold(init, f)` ⇒ `foldList` (+`sumBy` כשה-init מספרי); `.reduce(f)` ⇒ `reduceList`; `.map(f)` ⇒ `mapList`; `.any(f)`/`.every(f)` ⇒ `anyList`/`everyList`. מדידה: boxTotal ⇒ fieldOf+**sumBy** · campaignTotal ⇒ sumBy+fieldOf+eqDyn+fieldPred · grandTotal ⇒ foldList+sumBy+addDyn.
2. **נחיתה בדרך הרגילה**: `new/dart-maor/op-sum-by.dart` (הכותרת והגוף מפלט-הקרצף, לא ביד) · `search-record … --creates … --none` מול **האורקל-שלפני** (הלקח: reindex מוקדם הכניס את sumBy עצמו למועמדים ⇒ שוחזר ונרשם מחדש; 24 מועמדים חזקים מנומקים בשמם) · logic-census · oracle --write · auto-logic · pins-check --write · `search-proof-check` ✓.
3. **logic-proof.mjs — הרתמה-המקומפלת**: `lam()` הקליד תקע-למבדה לפי **ret של החלקיק-התקוע** (fieldOf ⇒ dynamic); השקע של sumBy הוא `num Function(dynamic)` ⇒ Dart זרק בזמן-ריצה ⇒ 3/3 «unknown» ⇒ ∅ כוזב (40,540 מועמדים «unknown» בריצה). רתמת-הקבצים (`proveCandidates` ישירות) הוכיחה את אותו עץ 4/4 — ההבדל היה ברתמה, לא בחלקיק. תוקן: טבלת `PT` (טיפוס-השקע לכל פרמטר-פונקציה) ו-`ev(…, want)` — הלמבדה מוקלדת לפי השקע שאליו היא נתקעת.

## מדידות
| פקודה | לפני | אחרי |
|---|---|---|
| `behavior-plan --needs g4` («כמה בסך הכל») | ∅ (top: warehouseValue 1/3) | **`sumBy(p0,λfieldOf(_,'amount'))`** · 4/4 · ties 1 · weak false (12s) |
| `behavior-compose --plan goal-plan.json` ⇒ `gen_goal_payments.dart` | 4 התנהגויות · ∅ 2 | **5 התנהגויות** (`num bhTotalDue(List<dynamic> p0) => sumBy(p0, (x) => fieldOf(x, 'amount'))`) · ∅ 1 |
| `dart analyze` / `dart run --enable-asserts …_proof.dart` | 0 / 12/12 | **0 / 15/15** |
| רגרסיה: `--needs sock-needs.json` · `--needs fn-needs2.json` | (up-values/up-examples) | **זהה** — 11 צרכים, אותם picks (t1 mulDyn · t2 whereList(λfieldIsNull) · t3 cockpitDaysSince · t5 addTo(w,addDyn) · t6 if(p2){addTo} · psak.noOwner/countNoOwner/noOwnerNull/countNoOwnerNull) — אותם ties/weak (3:08) |
| g3 «רק התשלומים באיחור מעל 30 יום» (סינון-רשימה) | ∅ | עדיין ∅ (33s): whereList(p0, λ(היום > addDaysIso(fieldOf(x,due),30))) = 4 צמתים — מעבר לתקרת-העומק (3). הדרך: שימוש-חוזר ב-bhOverdue30 המוכח כאטום (הלולאה של צעד 10: פלט ⇒ קלט) |

## מה נשאר
- פסק ופירוק למטרה חופשית (צעדים 1-2) — up-compose «מה נשאר».
- צעד 10: ההתנהגויות עדיין לא נצרכות ממסך מחולל (app-ds).
