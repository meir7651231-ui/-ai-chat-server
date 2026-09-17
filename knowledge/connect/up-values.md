# up-values — «המנוע יודע מה הוא מחפש»: חיפוש-מונחה-ערכים · קומפילציה-פעם-אחת · 12 סוגי-שקע

הכרעות-הבעלים: "בחיפוש הוא לא יודע מה הוא מחפש" · "תחבר אותם נכון" (synth × behavior-plan) · "שניות, לא דקות" · "תלמד אותו את כל השקעים במכה אחת".
כל מספר כאן מלווה בפקודה. ענף: claude/up-fnsocket-260917 (על up-carve-ops ⇒ up-chain3 ⇒ up-proof).

## מה שודרג (מנועים קיימים בלבד)
1. **logic-proof.mjs — רתמה-מקומפלת-פעם-אחת (`buildInterp`/`evalInterp`)**: קובץ-Dart אחד לצורך שמייבא את כל אטומי-המדף (997) + טבלת שם⇒פונקציה + הדוגמאות + פרשן-עצים (Function.apply; תקע-למבדה מוקלד לפי טיפוס-ההחזרה). `dart compile kernel` ⇒ .dill ב-~1s; אלפי עצים = הרצה אחת. העץ הוא דאטה (חיווט), לא קוד מחולל. + מצב `values` (ערך-ביניים לכל תא) + תאי-∅ (חריגה = ספק, לא 0).
2. **behavior-plan.mjs — `valueSearch`** (ברירת-מחדל לצרכים חיצוניים; `--blind` מחזיר למניית-עצים; NEEDS הקשיחים ללא שינוי): קדימה מהקלטים — כל ביטוי רץ על הדוגמאות, ביטויים עם אותם ערכי-ביניים מתמזגים (העיקרון של synth.mjs); אחורה מהתשובה — טיפוס שאינו מגיע לטיפוס-התשובה בצעדים שנותרו נזרק; סדר מבני בלבד: כיסוי-פרמטרים ⇒ התאמת-טיפוס-לתשובה ⇒ צמתים ⇒ עלות ⇒ id. אפס מילים.
3. **12 סוגי-שקע בעץ**: ערך (p) · תת-עץ (a) · ליטרל/סכמה (c; `consts` או `entity` ⇒ שמות-שדות מ-shape-ops.json) · פונקציה (f, תקע-למבדה, גם מקונן) · זמן (t, `clock` ⇒ `now` מהדוגמה) · אדם (h, `human` ⇒ ערך מהדוגמה; חסר ⇒ ∅) · עולם (w, `world` ⇒ יומן מוזרק; אפקט מוכח דרכו) · שומר-סף (g, `guard` ⇒ pred×אפקט) · ספק (∅ מתפשט) · שימוש-חוזר (`reuse`) · רוטינה (`routine` מטא-דאטה) · חוצה-שפה — **לא נבנה**.
4. ast_carve `--ops`: גם `fieldOf`/`fieldPred` (תנאי על שדה, שקע-פונקציה) ו-`addTo` (אפקט); `carve _falsy` ⇒ `falsy` ציבורי. 58 חלקיקים (scratchpad; לא נחתו — שער search-proof).

## מדידות (עם 58 החלקיקים על המדף בעץ-עבודה; `--needs <file>`; DART לא מוגדר ⇒ resolveDart)
| סט | צרכים | זמן כולל | נפתרו |
|---|---|---|---|
| psak-needs (6) | daysSince · over7 · **bochurLate** · noOwner · countNoOwner · recordSignal | **86s** | 3 מוכחים (bochurLate: 80,004 הערכות, 33 עצים) · noOwner ∅ (אין שם-שדה בקובץ-הפסק) · countNoOwner חיובי-שווא (דוגמה אחת) · recordSignal ללא world |
| record-needs (4) | noOwner (null או '') · countNoOwner · noOwnerNull · countNoOwnerNull | **66s** | **4/4**: `whereList(p0,λfieldPred(_,'owner',λfalsy(_)))` · `lengthList(whereList(…))` · … |
| socket-needs 1–5 | reuse · schema · clock · human · world | **75s** | reuse `mulDyn(p0,p0)` ✓ · schema `whereList(p0,λfieldIsNull(_,'first'))` ✓ (המפתח מ-Member) · clock `cockpitDaysSince(p0,now)` ✓ · world `addTo(w,addDyn(p0,p1))` ✓ · human: המנגנון ∅ עבד (`gtNum(p0,?limit)` 2/3 + ∅1) אך עץ מקרי עבר 3/3 — דוגמאות חלשות |
| socket-needs 6–7 | guard · routine | **10s** | guard `if(p2){addTo(w,addDyn(p0,p1))}` ✓ · routine: מטא-דאטה עובר; הצורך עצמו עם דוגמה אחת (חלש) |
לפני (up-chain3, מניית-עצים): bochurLate ∅ אחרי 6,028 עצים · 25 דק' ⇒ פסק-זמן; ריצות משולבות קרסו על זיכרון (134).
אפס-רגרסיה: `behavior-plan.mjs --gate` ⇒ ✓ 43/43 (43 מוכחים · 1 בשרשרת).

## לקחים (שנמדדו)
- ok=0 עם ערכים = ערך חי; בדיקת-חיות שגויה גזרה את המאגר ל-2 (bochurLate ∅ עד התיקון).
- מיון לפי "עלות" (מספר פרמטרים) גזר את העצים שצורכים יותר פרמטרים — בדיוק אלה שהצורך דורש. כיסוי-פרמטרים קודם.
- דוגמה אחת מזמינה חיובי-שווא (popCall ×3, exportAllowed(priLabel) ב-human). הפסק חייב ≥3 דוגמאות, ולשקע-אדם — דוגמה שבה הערך חסר לא מוכיחה כלום על עצים שלא משתמשים בו.
- הזמן היה בקומפילציה, לא בהרצה: 12ms/מועמד ⇒ ~0.3ms/מועמד.

## לא נעשה
- שקע חוצה-שפה (ast-js-to-dart ⇒ פרשן): לא נבנה. · 58 החלקיקים לא נחתו (הכרעת-בעלים, שער search-proof).

## up-crosslang — שקע #12 (חוצה-שפה) · 12/12 · תיקוני-כלים (17.9 · 07:00–08:00Z)
ענף: claude/up-fnsocket-260917 (המשך). כל מספר עם הפקודה שלו; DART=/root/dart-sdk/bin/dart.
1. **logic-proof.mjs — `jsTwinRows(hideDart, sig)`**: אטום-JS טהור ב-new/atoms בלי תאום-Dart (לפי logic-census) ⇒ ast-js-to-dart ממיר (טיפוסי-השקעים של הצורך מכוונים את הממיר כשהאריות שווה; אחרת type-evidence.json) ⇒ `.prove/interp/js/<name>.dart` ⇒ נכנס לרתמה-המקומפלת כמועמד. לא מתקמפל ⇒ נזרק (לולאת-drop עד 12 סבבים ב-`buildInterp`). ניצח ⇒ `jsParity`: ה-JS המקורי על ארגומנטי-הדוגמאות מול ערכי-Dart (ה-JS = אמת). באג שתוקן: `sig` הוצל ע"י `const sig` (ReferenceError) ⇒ `dsig`.
2. **ast-js-to-dart.mjs — `isStrParam`**: מקלט מוקלד-String (ליטרל / פרמטר מוקלד מהראיות או מטיפוסי-הצורך) ⇒ `slice(a,b)` = `substring`, לא `sublist`. מדידה: `node emit/parity-ast.mjs --evidence` ⇒ **777/1099** מתקמפלים (היה 774/1099; אותו יתר-שגיאות).
3. **behavior-plan.mjs — `capLevel` 4000 ⇒ 20000** (BP_CAPV): countNoOwner/countNoOwnerNull יצאו ∅ כי 4000 גזר 9,781 ביטויים בעומק-2 (נבדק: זהה גם בלי תאומי-JS ⇒ לא השקע החדש). ההערכה ברתמה-המקומפלת זולה ⇒ התקרה עלתה.
4. **search-record.mjs — `OUT` הוחזר**: G63 (0771b19b) הסיר את `OUT` יחד עם IDX/LOG כשעברו ל-search-score ⇒ הכלי קרס (ReferenceError) על כל רשומה. תוקן.

| סט (`--needs knowledge/connect/socket-needs.json` / `/tmp/fn-needs2.json`) | זמן | תוצאה |
|---|---|---|
| xl.monthKey (hideDart: monthKey) | 37s (עם xl.levenshtein) | **pick=monthKey(p0) · sockets=[cross-language] · parity ok 3/3** — התאום שהומר מ-new/atoms/month-key.mjs |
| xl.levenshtein (hideDart: levenshtein) | (שם) | damerauLevenshtein(p0,p1) מהמדף — התאום המומר לא נדרש |
| x.look.pick | 43s (עם t4b) | ∅ — pickLook: `for-in` לא נתמך בממיר (מגבלה מוצהרת) |
| t4b.human.overLimit.strong | (שם) | cmpGtDyn(p0,?limit) · sockets=[human] |
| socket-needs t1–t7 (cap 20000) | 98s | t1 mulDyn(p0,p0) · t2 whereList(p0,λfieldIsNull(_,'first')) · t3 cockpitDaysSince(p0,now) · t4 ∅ (דוגמאות חלשות, ראה t4b) · t5 addTo(w,addDyn(p0,p1)) · t6 if(p2){addTo(w,addDyn(p0,p1))} · t7 routine {every:week} |
| record-needs 4 (cap 20000) | 75s | **4/4** (ב-cap 4000: 2/4 — countNoOwner ∅) |

12 סוגי-שקע מוכחים בריצה: p · a · c · f · t · h · w · g · ∅ · reuse · routine · cross-language.
הערה: המדידות רצות עם 58 החלקיקים על המדף (נוחתים בקומיטים הבאים דרך search-record ⇒ search-proof).
