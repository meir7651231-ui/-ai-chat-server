# ‏[W] goal-pipeline — הפקודה-האחת: מטרה-בעברית ⇒ פסק · אפס-המצאה · הוכחה · שימוש-חוזר · Dart · משטרה

> ענף `claude/w-goal-pipeline-260917` · בסיס `claude/up-connect-260917` (‏27c7cc12).
> **כל מספר כאן נושא את הפקודה שהפיקה אותו.** מה שלא נמדד — כתוב «לא נמדד», לא «ירוק».

## 1 · מה נבנה — מצב במנוע הקיים, לא מנוע חדש
`machtzev/generator/behavior-plan.mjs --goal <goal.json> [--ns <שם>] [--out <dart-gen-bs/…>]`
כאשר `goal.json = {"text": "<המטרה בעברית>", "needs": {…כמו --needs}}` ⇒ **לדג'ר אחד** ו**קובץ-Dart מורכב**, בפקודה אחת:

| # | צעד | מי עושה אותו (מנוע קיים) |
|---|---|---|
| 1 | **לפני** — פסק על הטקסט | `yeshiva/purpose.purposeDoc` (‏`rule` כשיש `goal.spec`) ⇒ מקורות · מתגים · חובה/רשות |
| 2 | **תוך כדי** — אפס-המצאה לכל צורך | `hamtzaa.mjs --needs … --goal … --json` כשקיים; אין ⇒ שורת «לא-זמין» **עם הסיבה** + בדיקה-מבנית (‏`needStructure`) |
| 3 | חיפוש + הוכחה-בריצה + בחירה | `planNeeds` — אותו בורר, אפס לוגיקת-בחירה חדשה. בשורה: pick · ties · weak · discriminators · depth |
| 4 | **שימוש-חוזר** — התנהגות-שהוכחה = אטום לצורך הבא | `behavior-compose --plan` ⇒ `rowsFromDart` ⇒ `planNeeds({extraRows})`, **בלולאה עד קיבעון** |
| 5 | חיווט ⇒ Dart | `behavior-compose --plan` (spawn) ⇒ `gen_goal_<ns>.dart` + `_proof.dart` |
| 6 | **אחרי** — משטרה בתוך הריצה | `dart analyze` · `dart run --enable-asserts` (ההוכחה) · `no-fakers-check` · `flutter analyze` (או «לא-זמין» עם הסיבה) |
| 7 | הלדג'ר | `machtzev/generator/goals/<ns>/ledger.json` + `ledger.md` |

כשל-משטרה = שורה אדומה בלדג'ר **ו-exit 1**. צורך שנפסל בצעד 2 **אינו ממשיך** להוכחה, והסיבה נרשמת.

## 2 · הריצה המלאה (הקבלה)
```
node machtzev/generator/behavior-plan.mjs --goal /tmp/gp/goal.json --ns payments     # 209s · exit 0
```
```
 1/7 פסק: ∅ — 0 מקורות · 3 מתגים · חובה 0 · רשות 0 · תחום — · rule: לא נקרא (אין goal.spec)
🟡 2/7 אפס-המצאה: לא-זמין — --needs עוד לא נתמך ב-hamtzaa ⇒ בדיקה-מבנית בלבד · 7/7 המשיכו להוכחה
 3/7 חיפוש+הוכחה: ∅ — סבב 1: 5/7 נפתרו · g3a · g3 ∅
✓ 4/7 שימוש-חוזר: עבר — סבב 2: 5 התנהגויות במדף ⇒ 1/2 (g3a) · סבב 3: 6 התנהגויות במדף ⇒ 1/1 (g3)
✓ 5/7 חיווט ⇒ Dart: עבר — 7 התנהגויות מוכחות · ∅ 0 · הוכחה 22 דוגמאות
✓ 6/7 משטרה: עבר — dart analyze: עבר · dart run --enable-asserts: עבר · no-fakers: עבר · flutter analyze: לא-זמין
✓ 7/7 לדג'ר: עבר
✓ 7/7 צרכים מוכחים · 3 סבבים · new/dart-gen-bs/gen_goal_payments.dart · 209s
```
הלדג'ר המלא: `machtzev/generator/goals/payments/ledger.md` · `ledger.json`.

| צורך | נבחר | צמתים | סבב |
|---|---|---|---|
| g1.clock.overdueDays | `cockpitDaysSince(p0,now)` | 1 | 1 |
| g2.predicate.overdue30 | `cmpGtStr(now,addDaysIso(p0,30))` | 2 | 1 |
| g3a.predicate.recordOverdue30 | `fieldPred(p0,'due',λbhOverdue30(_,now))` | 2 | **2** (שימוש-חוזר) |
| g3.collection.overdueList | `whereList(p0,λbhRecordOverdue30(_,now))` | 2 | **3** (שימוש-חוזר) |
| g4.measure.totalDue | `sumBy(p0,λfieldOf(_,'amount'))` | 2 | 1 |
| g5.format.reminder | `pp(p1,p0)` | 1 | 1 |
| g6.world.sendReminder | `addTo(w,addDyn(p0,p1))` | 2 | 1 |

**אפס אטום חדש נכתב ביד** — כל שבע ההתנהגויות הן עצי-חיווט מהמדף, שתיים מהן מעל התנהגויות שהוכחו באותה ריצה.

גם בלי `--ns` (‏ns נגזר משם-הקובץ), נמדד על מטרה קטנה:
```
node machtzev/generator/behavior-plan.mjs --goal /tmp/gp/tiny.json    # 10s · 1/1 · 7 שורות-צעד · ns=tiny
```

## 3 · רגרסיה — 11/11 ה-picks זהים לבסיס
```
node machtzev/generator/behavior-plan.mjs --needs /tmp/gp/sock-needs.json --out …   # t1…t7 (t4 ∅)
node machtzev/generator/behavior-plan.mjs --needs /tmp/gp/fn-needs2.json  --out …   # psak.* ×4
```
| קובץ | בסיס (27c7cc12) | אחרי | זהה |
|---|---|---|---|
| sock-needs (7) | mulDyn · whereList(λfieldIsNull) · cockpitDaysSince · ∅ · addTo(addDyn) · if(p2){addTo(addDyn)} · siteLangs | אותו דבר | 7/7 |
| fn-needs2 (4) | whereList(λfieldPred(λexportAllowed)) · lengthList(…) · whereList(λfieldIsNull) · lengthList(…) | אותו דבר | 4/4 |

## 4 · שלושה תיקוני-מנוע — כל אחד עם המדידה שחייבה אותו
1. **‏off-by-one ב-`valueSearch`** (הטלאי של המנהל — אומת ואומץ): `canReach(e.type, maxDepth - depth - 1)` ⇒ `maxDepth - depth`.
   *מדידה:* `BP_DEBUG=1` על g3a — לפני: `depth 3 pool 26 fresh 20`; אחרי: `depth 3 pool 89 fresh 83`.
   **הערה חשובה:** הטלאי תיאר «עצירה בלי depth 3» — בפועל עומק-3 **כן** רץ (‏`evaluated 14156`), והתיקון מרחיב את המאגר פי-3.4; **לבדו הוא לא פותר את g3a** (עדיין ∅). מה שפתר: השימוש-החוזר.
2. **שקע-מוצהר בתוך תקע-למבדה** (`SOCK_LEAVES` ב-`plugsFor`): הפרמטרים-הנותרים של חלקיק-בתקע התמלאו **מליטרלים בלבד**, ולכן שקע-שעון/אדם/עולם שהצורך הצהיר לא יכול היה להיכנס ללמבדה.
   *מדידה:* בלעדיו g3 מייצר רק `λbhRecordOverdue30(_,'due')` ⇒ `usesAll('t')` נכשל; איתו `whereList(p0,λbhRecordOverdue30(_,now))` — `BP_WANT=… ⇒ evaluated {"ok":3,"total":3}`.
   הפרשן (`logic-proof.ev` case `'f'`) ו-`treeDart` **כבר** תמכו בצומת-שקע בתוך args — רק הייצור לא ייצר.
3. **תקרת-הרמה 20000 ⇒ 40000** (`BP_CAPV`). זה **לא** שיפור-בחירה אלא מחיר של (2): הרמה גדלה ⇒ ביטויים שנחתכו.
   *מדידה:* g2 נמצא במנוע-הבסיס ב-21,514 ביטויי-עומק-1 — **1,514 מעל התקרה**; אחרי (2) הרמה גדלה ל-38,768 ו-`addDaysIso(p0,30)` נגזם ⇒ g2 ∅. ב-40000: g2 חוזר (`cmpGtStr(now,addDaysIso(p0,30))`), והרגרסיה 11/11 זהה. מחיר: ×2 זמן.
   נגיעה במסלול-הצרכים-החיצוניים בלבד — `NEEDS` הקשיח (שער `behavior`) רץ ב-`values:false` ואינו נוגע ב-`valueSearch`.
4. **`behavior-compose`: קובץ-באותה-תיקייה ⇒ `'./x.dart'`** (ולא `'x.dart'`). ייבוא בלי-נקודה נראה ל-`isPure` כחבילה ⇒ **הקובץ-המחולל נפל מהמדף בסבב-השימוש-החוזר** (נמדד: `isPure('dart-gen-bs/gen_goal_probe.dart') = false`). זה היה הבאג היחיד שמנע את g3 אחרי (2).
5. שקעי-מדידה חדשים (לא לוגיקה): `BP_DEBUG` מדפיס ספירת-תקעים; `BP_WANT=<exprId>` אומר על עץ מבוקש «לא נוצר / נגזם בתקרה / הוערך ⇒ …».

## 5 · מה **לא** נעשה / לא נמדד — במפורש
- **צעד 2 רץ במצב «לא-זמין»**: `hamtzaa --needs` עדיין לא קיים (עובד-מקביל [W] psak-goal). הקריאה עטופה ב-try/catch **ומדווחת את הסיבה בלדג'ר**, לא מדלגת בשקט. הבדיקה-המבנית שכן רצה: params/ret/דוגמאות/שקע-שעון-בלי-`now`. על מטרת-התשלומים היא פסלה **0 צרכים**.
- **צעד 1 ענה ∅** — `purposeDoc` על משפט-מטרה מחזיר 0 מקורות · 3 מתגים (בדיוק כמו שהמנהל מדד). השדרוג של `purpose` הוא של העובד-המקביל; כאן רק חוט + דיווח.
- **`flutter analyze` לא רץ**: אין `flutter` ואין buildsmart בקונטיינר (`R.bsRoot() = null`) ⇒ שורת «לא-זמין» עם שני הערכים, לא «עבר».
- הקובץ המחולל **מייבא את עצמו** בקידומת (`import './gen_goal_payments.dart' as c2_1;`) כשהתנהגות מסתמכת על התנהגות קודמת. חוקי ב-Dart, `dart analyze` נקי (נמדד) — אבל זו צורה שכדאי להכריע עליה (קריאה-ישירה במקום ייבוא-עצמי) בגל הבא.
- **הסביבה:** הקלון היה shallow ולכן שער `learn` היה אדום **גם על העץ הנקי של הבסיס** (`ref blob … לא נמצא`). תוקן ב-`git fetch --unshallow` (‏1338 commits). זה לא היה שינוי-קוד.

## 6 · משטרה
```
node machtzev/pins-check.mjs --write     # behavior-plan.mjs הוא סקריפט-שער (DERIVED) — 139 קבצים
node machtzev/police.mjs --fast          # ✅ 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57
```
