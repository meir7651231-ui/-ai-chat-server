# up-carve-ops — החוצב יורד רמה אחת: מפונקציה לביטוי (חלקיקי פעולות-יסוד)

הכרעת-הבעלים: "יש מנוע שיודע להוציא מאטום רק את מה שהוא צריך" — ast_carve חצב פונקציה שלמה; עכשיו הוא חוצב גם את
פעולות-היסוד שבתוכה (ביטוי-בינארי · מתודת-core · תכונת-core) כחלקיקים עם חתימה. ליטרל-מפתח ב-`r['key'] == null` הופך לשקע.

## השדרוג (מנוע קיים: machtzev/carve/ast_carve.dart)
- `--ops <file> <fn> [line]` ⇒ {particles:[{name,kind,params,ret,sig,source,expr}]} · `--ops-batch jobs.json` ⇒ חלקיקים ייחודיים + ספירת-מוצא.
- טיפוסים: cast (`as T`) · ליטרל · פרמטר-מוצהר · תכונות/מתודות-core ידועות; אחרת `dynamic`. אפס מילון-דומיין. +166 שורות. ריצה-בודדת (`carve`) לא השתנתה.
- pubspec: analyzer ^6.11 אינו נפתר מול Dart 3.13 (macros/_macros) ⇒ ^7.4.0 (אותו API; ^14 שובר name2/NamedExpression).

## מדידה (כל מספר עם הפקודה)
```
dart run ast_carve.dart --ops-batch jobs.json   # jobs = 963 שורות machtzev/generator/logic-census.json
⇒ פונקציות: 963 · נכשלו: 0 · חלקיקים ייחודיים: 54 · 8.2s     (carve-ops-particles.json)
   lengthList 178 · eqStr 163 · isNull 147 · ltNum 139 · whereList 108 · gtNum 93 · subNum 84 · geNum 74 · …
```
נחיתה-ניסיונית בעץ-עבודה (לא ב-commit): 54 קבצי `new/dart-maor/op-*.dart` ⇒ logic-census 963⇒1017 ⇒ oracle 1941 אטומים.
```
DART= node machtzev/generator/behavior-plan.mjs --needs knowledge/connect/psak-needs.json   # 2m47s · psak-plan-with-ops.summary.json
```
| צורך | לפני (up-chain3) | אחרי (עם 54 החלקיקים) |
|---|---|---|
| psak.daysSince | dayDiff ✓ | dayDiff ✓ |
| psak.over7 | ∅ (5,911 עצים, 0) | **gtNum ✓** (3 עברו-הכל: gtNum, gtDyn, cmpGtDyn) |
| psak.bochurLate | ∅ (6,028 עצים, 0) | **cmpGtDyn(cockpitDaysSince(p0,p1),p2) ✓** (6 עצים עברו-הכל מתוך 7,175) |
| psak.noOwner | ∅ | ∅ (3,109 הורצו; דורש פרדיקט-עם-מפתח כארגומנט-פונקציה — עץ-לפי-טיפוסים לא מייצר למבדות) |
| psak.countNoOwner | ∅ | lengthList∘popCall "✓" על **דוגמה אחת** ⇒ חיובי-שווא. עם 5 דוגמאות ⇒ ∅, הכי קרוב 3/5 |
| psak.recordSignal | אפקט | אפקט |
לקח: ההוכחה חזקה בדיוק כמו הדוגמאות — צורך עם דוגמה אחת מזמין חיובי-שווא (popCall, בפעם השנייה).

## שערים
`node machtzev/police.mjs --fast` בעץ עם השדרוג (בלי החלקיקים): ✅ ירוקה — 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57.

## מה לא נעשה (הכרעת-בעלים)
- 54 החלקיקים לא נחתו בריפו: נחיתת-אטום עוברת שער search-proof (רשומת-חיפוש לכל אטום חדש). הם ניתנים לשחזור מהפקודה למעלה.
- noOwner: הרכבה עם ארגומנט-פונקציה (whereList(xs, (r)=>fieldIsNull(r,'owner'))) — צעד הבא במנגנון-העצים.
