# NOTES · 2a-genpurity — החלטות, שיטה, דפוסים

## צעד-0 (אומת)
```
git rev-parse HEAD                                  ⇒ 52dc8d568f59e2cd634236de1345cc4ac23d4903  ✓
npm ci --prefix machtzev                            ⇒ added 1 package, 0 vulnerabilities
git fetch --depth=1000 origin claude/mizug          ⇒ FETCH_HEAD
node machtzev/census/engine-index.mjs --connected   ⇒ מחוברים-למחולל: 57 · לא-מחוברים: 279 · (מתוך 336)  ✓ כצפוי
```
`--write` לא הורץ. `engine-index.json` לא נגע. אפס commit מחוץ ל-`knowledge/connect/`.

## ההגדרה שעבדתי לפיה (לא פרפרזה — הקוד)
`machtzev/census/engine-index.mjs:319-334`:
- `GEN_ENTRY` = 6 קבצים: `app-ds` · `regen` · `ship` · `genesis-gen` · `app-from-sentences` · `balagan`.
- `connected()` = סגור-טרנזיטיבי של `importedBy` מנקודות-הכניסה, **ועוד** כל מנוע ששמו-היחסי מופיע בטקסט של `regen.mjs`/`ship.mjs` (הרצה-בשם), ואז סגור שוב.
- שערים אינם מחוברים. זה מפורש בהערה שם.

## 🔴 הדפוס החוזר #1 — האינדקס עיוור ל-`await import()`
`importsOf` (‏`engine-index.mjs:162-170`) תופס `from '…'` בלבד. אין בו שום דפוס ל-`import('…')` דינמי.
לכן **מנוע שמגיעים אליו רק בייבוא דינמי נספר «לא-מחובר» גם כשהוא רץ בפועל**.

בקבוצה שלי זה נגע ב-2 מנועים, בשני כיוונים הפוכים:
- `shape-ops.mjs` — **חיובי-שווא של «מנותק»**. מיובא דינמית מ-`render-module.mjs:116` ומ-`sentence.mjs:81`, ושניהם מחוברים. הוכחתי בריצה (‏`probe.mjs` ⇒ `ops: ["channel","temporal","calendar","expiry","holidayGuard"]`). **אין מה לחבר — יש מה לתקן במודד.** s22=0 בכוונה.
- `intent.mjs` — הייבוא הדינמי קיים (`tzinor.mjs:435`) אבל הפונקציה שעוטפת אותו, `tzinor.purposeOf`, **אין לה אף קורא בריפו**. כלומר הוא באמת מנותק, רק לא מהסיבה שהאינדקס חשב. ענף-מת בתוך קובץ חי.

**המסקנה למנהל:** המספר 279 כולל לפחות מקרה-שווא אחד מוכח. תיקון `importsOf` יזיז את הספירה. לא תיקנתי — אסור לשנות קוד.

## 🔴 הדפוס החוזר #2 — «נקרא-בשם» באינדקס הוא התאמת-שם, לא ראיה
הכרטיס מדפיס `נקרא-בשם: X`. בדקתי כל אחד לפי **נתיב** ומצאתי התאמות-שווא:
- `pure/shot.mjs` מדווח «נקרא-בשם: ship». בפועל `ship.mjs:98` קורא ל-`machtzev/tools/site-shot.mjs` — קובץ אחר לגמרי. `pure/shot.mjs` אינו נקרא משם.
- האינדקס עצמו מתעד את המחלה הזאת בהערה ב-`engine-index.mjs:234` (‏`run.mjs`⇄`balagan-run.mjs` ⇒ 16 מנועים תבעו שער שאינו שלהם).
לכן כל שורת-`callers` בדוח נשענת על grep-לפי-נתיב, לא על הכרטיס.

## 🔴 ממצא-לוואי — נתיב מת ב-chisel-all
`machtzev/chisel-all.mjs:118` מריץ `machtzev/reconvert-data.mjs`. הקובץ הזה **אינו קיים** (`ls` ⇒ No such file); הוא יושב ב-`machtzev/purity/reconvert-data.mjs`. הקריאה נכשלת/לא-עושה-כלום בשקט. לא תיקנתי (מיפוי בלבד) — מדווח.

## החלטות
1. **ריצות-אמת מותרות, זיהום אסור.** הרצתי מנועים כדי לקבל ראיה, עם `GEN_OUT` מוטה ל-scratchpad. `generate.mjs` מסלול-2 בכל-זאת כתב 2 קבצים לריפו (‏`combine-screens.mjs:70` כותב לתיקיית-הקורפוס) — מחקתי אותם מיד ואימתתי `git status` נקי. הכתיבה הזאת עצמה נרשמה כ-`doesNot` של combine-screens, כי היא מגבלה אמיתית לחיבור.
2. **s22=0 הוא תשובה לגיטימית ואני משתמש בו.** המשימה דורשת לומר במפורש כשמנוע אינו מקרב את §22. שער-משטרה, כלי-מדידה ומנוע-שכבר-מחובר מקבלים 0 עם נימוק.
3. **«לא מחובר» מפורק ל-4 סיבות** (נדרש ע"י המשימה): `נטוש` · `הוחלף(legacy)` · `כלי-מדידה/שער` · `פשוט לא חובר`. הסיבה נכתבת ב-`s22.why` או ב-`connectAt.gives`.
4. **כותרת-קובץ אינה ראיה** — נאכף. הדוגמה החדה: `generate.mjs:2` מכריז על עצמו «הכניסה-האחת של המחולל (§22)», ואינו ב-`GEN_ENTRY`.

## פקודות שהורצו (מצטבר)
```
node machtzev/census/engine-index.mjs --connected
node machtzev/census/engine-index.mjs --connected --list
node machtzev/census/engine-index.mjs <קובץ>            # ×42
node machtzev/generator/generate.mjs -n probe_zz "זזזז קקקק"
GEN_OUT=… node machtzev/generator/generate.mjs -n probe_alert "התרע כשמלאי חורג מ-100"
node machtzev/generator/generate.mjs -n probe_comb "רשימת תלמידים"     # ואז rm + git status
node /tmp/claude-0/probe.mjs                             # sentence.fieldOpsOfSentence ⇒ shape-ops נטען בריצה
node machtzev/generator/entity-terms.mjs --gate          # ⚪ אין maor-system
node machtzev/generator/enum-values.mjs --gate           # ⚪ אין maor-system
grep -rn "<path>.mjs" --include=… .                      # קוראים לפי נתיב, ×42
```

## מה לא הצלחתי / פתוח
(מתעדכן עד הסוף)

## 🔴 ממצא — `op-bridge` התיישן בשקט כי אף אחד לא מריץ אותו
`op-bridge.mjs` בנוי כשער מלא (יש לו `--gate` ב-op-bridge.mjs:45-57), אבל **אינו רשום ב-police.mjs**
(`grep -c "op-bridge" machtzev/police.mjs` ⇒ `0`). התוצאה: `--gate` אדום היום.
כימתתי בלי `--write` (הרצתי `learn()` בזיכרון והשוויתי לקובץ):
```
g2: 48≡48 · g1: 33≡33          — הקבוצות זהות
modules DIFF                    — crs: 25 ⇒ 26 G1-ops
affinity cells differing: 1564 of 1584
```
כלומר המטריצה המחויבת אינה מתארת את הזהב הנוכחי. **לא תיקנתי** (אסור `--write`, אסור לשנות קוד).

## 🔴 ממצא — `frag-ops` מדווח על עצמו הסכמה 24%
`node machtzev/generator/frag-ops.mjs --gate` ⇒ `הסכמת-מודול (חזקות 25): top-1 6 · top-2 8`.
זה הפלט של השער עצמו, לא הערכה שלי. משמעות: הייחוס-לפי-ops עדיין אינו בשל להחליף את
`retarget.pickModule`. רשמתי s22=1 ולא 3 בגלל זה — נקודת-החיבור כנה, הבשלות לא.

## הערה — הערה-בקוד שהתיישנה
`hamtzaa.mjs:257` כותב «החוב היום 211/408». הריצה בפועל (`--ratchet`) מחזירה `51/288`.
בדיוק הדפוס ש-HANDOFF מזהיר מפניו: «מספר שנכתב ביד מתיישן בשקט». מדווח, לא נגעתי.

## מה מדולג בקונטיינר הזה (ולא נספר כירוק)
- `golden-harness --gate` ⇒ `⚪ אין buildsmart ב-/home/user/buildsmart/app_flutter — מדולג`
- `balagan-run --gate` ⇒ תלוי באותו שורש חסר + אתר בנוי
- `entity-terms --gate` · `enum-values --gate` ⇒ `⚪ אין maor-system` (‏`ls -d ../maor-system` ⇒ No such file)
זה **ההיקף** ולא סתירה — CLAUDE.md אומר זאת מראש (‏179 מנועים בריפואים-אחים; בקלון-טרי 336).
עבור אלה כתבתי `skipped` ולא `ran`, והציון ניתן על סמך קריאת-קוד בלבד — מסומן במפורש.

## 🔴 אזהרה תפעולית — `legacy/entities.mjs` משחית בקלון-טרי
אותה מחלקה בדיוק כמו `engine-index.mjs --write` שהמנהל אסר:
- שני מקורותיו (`/home/user/maor-system/src/types/domain.ts`, `/home/user/buildsmart/app_flutter/lib/domain/domain.dart`) **אינם קיימים כאן**.
- `entities.mjs:22-23` עושה `catch { continue; }` על מקור חסר — בשקט.
- `entities.mjs:38` כותב `entities.json` **ללא תנאי**.
- הקובץ המחויב הוא `"count": 60`.
⇒ הרצה בקלון-טרי הופכת 60 ל-0. **לא הרצתי אותו.** כל שאר ה-42 הורצו או נקראו.
המלצה למנהל: להוסיף אותו לרשימת-האיסור לצד `engine-index --write`.

## מצב legacy/ — «הוחלף» **ועוד** «שבור» (ראיה, לא הנחה)
`legacy/README.md:2` מצהיר על ההחלפה. בדקתי בפועל מה עוד רץ:
| קובץ | ריצה |
|---|---|
| `nl.mjs` | ✅ רץ — `«רקע נושם» → GlowPulse (7.7)` (כי הוא מייבא `../match.mjs`, מחוץ ל-legacy) |
| `compose.mjs` | ✅ רץ — נצרך בהצלחה בתוך nl (‏`screens-seed/machine` ⇒ 254 מסכים קיימים) |
| `app.mjs` | ❌ קורס — `ENOENT … legacy/specs/app_ent1.txt` (app.mjs:45) |
| `teach.mjs` | ❌ קורס — `ENOENT … legacy/atlas.json` |
| `entities.mjs` | ⛔ לא הורץ — משחית (לעיל) |
הדפוס: כשהתיקייה הועברה ל-`legacy/`, כל נתיב **יחסי-לעצמה** נשבר; מי שמייבא מבחוץ שרד.

## הערך היחיד ששורד ב-legacy הוא קורפוס, לא מנוע
`screens-seed/machine` — 254 מסכים עם `sectionMap`+`composer` מפורקים. אף מנוע **מחובר** אינו נוגע בו.
`retrieve-screen.mjs` מאחזר מטקסט-תוכן בלבד ואין לו את המבנה. זו הערה למנהל, לא המלצת-חיבור.

## 🔴 דפוס #3 — «שער» שאינו במרשם-השערים מתיישן בשקט
`machtzev/gates.tsv` הוא מרשם 57 השערים. שלושה מנועים בקבוצה שלי מתנהגים כשערים אך **אינם שם**:
| מנוע | מצבו עכשיו | police.mjs | gates.tsv |
|---|---|---|---|
| `generator/op-bridge.mjs` | `--gate` **אדום** | 0 | — |
| `pure/pure-lint.mjs` | `--strict` **exit 1** (2 major) | 0 | 0 |
| `pure/pure-decompose.mjs` | `--check` **exit 1** (16 קבצים) | 0 | 0 |
שני האחרונים כן מורצים מ-`one.mjs:164,166` — אבל `one.mjs` אינו נקודת-כניסה, ו-`pure-decompose`
מורץ שם **ללא** `--check`, כלומר במצב-כתיבה: הוא מתקן את הסחיפה במקום לדווח עליה.
מסקנה: 57 שערים ב-ledger ≠ כל הבדיקות שקיימות. שלוש בדיקות אדומות חיות מחוץ למרשם.

## 🔴 דפוס #4 — «proof» שאינו מוכיח
`pure-e2e-proof.gen.mjs` ו-`pure-look-proof.gen.mjs` נקראים «proof» ושניהם **מדפיסים HTML ויוצאים 0**.
אפס `assert`, אפס `exit(1)`. אלה מחוללי-ראווה לעין אדם, לא הוכחות. שניהם: s22=0, «נטוש».

## `pure-forge` הוחלף — וזו מדידה, לא כותרת
| | `pure/pure-forge.mjs` | `machtzev/ds-forge.mjs` |
|---|---|---|
| פונקציה | `forgeFamily` (מיוצא) | `forgeFamily` (ds-forge.mjs:1318) |
| פלט | `new/dart-ui-bs/forged` — **13** קבצים | `new/dart-forge-bs` — **376** קבצים |
| ב-REGEN | ✗ | ✓ `regen.mjs:7` (שלב-1) |
| נצרך ע"י קוד מחולל | `grep -rln "forged_" new/dart-gen-bs` ⇒ **0** | כן |
⇒ ds-forge בלע את התפקיד. pure-forge = «הוחלף», והפלט שלו יתום.

## 🔴 דפוס #5 — «נקרא-בשם» מפורק סופית על `pure/shot.mjs`
הכרטיס מדווח `נקרא-בשם: ship`. בדקתי את שתי ההתאמות:
- `ship.mjs:98` קורא `machtzev/tools/site-shot.mjs` — **קובץ אחר**.
- `police.mjs` ⇒ ההתאמה היחידה היא בשורה 105, במילה **«snapshot»**.
⇒ `pure/shot.mjs` = אפס קוראים. גם התיעוד שלו (`PURE-STATE.md:44`) מפנה ל-`scratchpad/shot.mjs`
ברֵיפו `maor-system` שאינו קיים כאן.

## הרחבת דפוס #1 — האינדקס עיוור גם ל-`register()` של loader-hooks
`tighten-loader.mjs` הוא המקרה השלישי (אחרי `shape-ops` ו-`intent`) שבו «לא-מחובר» נובע מ**צורת-הקריאה**:
`tighten-hook.mjs:47` עושה `register('./tighten-loader.mjs', import.meta.url)` — מחרוזת, לא `import`.
ו-`tighten-hook` משרת את `tighten-types.mjs`, שהוא **שלב-3 ב-REGEN** (`regen.mjs:9`).
⇒ שלוש צורות-קריאה שה-`importsOf` לא רואה: `import()` דינמי · `register('…')` · הרצה-בשם שאינה מ-regen/ship.

## «לא מחובר» שהוא **תכנון** ולא חוב — entity-terms · enum-values
שניהם מחצבים חד-פעמיים מ-`maor-system` (ריפו-אח, אינו קיים כאן).
הארכיטקטורה: המנוע חוצב ⇒ הדאטה **מחויבת** ⇒ הצינור צורך **דאטה, לא מנוע** (§19-ד).
`entity-terms.data.json` אכן נצרך ע"י `tzinor.mjs` שהוא מחובר.
⇒ חיבור המנועים עצמם היה הופך את המחולל לבלתי-ניתן-להרצה בקלון-טרי. **s22=0 מסיבה טובה.**
לשניהם הציון ניתן על סמך קריאת-קוד + ריצת-דילוג — סימנתי זאת בגוף הרשומות.

## מונה-ביניים
31/42 · ‏11 נותרו (כל `machtzev/purity/`).

---

# סיכום — 42/42 הושלמו

## ספירה
- **42 מנועים** מהרשימה בדיוק (אומת: אפס חסרים · אפס עודפים · אפס כפולים · ספירת-השורות בכל רשומה אומתה מול הדיסק).
- **כל 42 נושאים לפחות ראיית-`ran:` אחת** (אומת בסקריפט).
- ציונים: **s22=3 → 4** · **2 → 4** · **1 → 4** · **0 → 30**.

## למה 30 קיבלו 0 — הפילוח (זו התשובה לשאלה «למה הוא לא מחובר»)
| סיבה | כמה | דוגמאות |
|---|---|---|
| **שער/כלי-מדידה** (בהגדרה אינו «מחובר») | 11 | balagan-look · balagan-one · balagan-run · server-gate · golden-harness · purity-data · independence-check · pure-lint · studio-full |
| **הוחלף** (יורש חי ומדוד) | 9 | 5× legacy · pure-forge (ds-forge 376:13) · dehardcode+gen-data-dart+purify (יורשים רצים ב-one) |
| **נטוש/שבור** | 5 | ast-purify · ast-purify-interp · shot · pure-e2e-proof.gen · pure-look-proof.gen |
| **מחצב מריפו-אח — בתכנון** (§19-ד) | 2 | entity-terms · enum-values |
| **מנוע-מחצבה בשכבה אחרת, מאגר מוצה** | 2 | purify-engine (1/1131) · purify-hard (0) |
| **כבר מחובר — טעות-מדידה** | 1 | shape-ops |

## 4 המנועים ששווה לחבר (s22=3)
1. **`generator/generate.mjs`** ⇒ `GEN_ENTRY` — כניסת-משפט-חופשי שלמה, שני מסלוליה הורצו והצליחו. גוררת איתה את capability + combine-screens + retrieve-screen.
2. **`generator/capability.mjs`** ⇒ `app-ds.mjs` — משפט⇒אפליקציה-רצה עם תנאי⇒התראה. יכולת שאין באף מנוע מחובר. ⚠️ לפני חיבור: הסף קבוע ב-60 (`capability.mjs:106`) ואינו נלקח מהמשפט — הפרת §20-ג בשורה אחת.
3. **`generator/op-bridge.mjs`** ⇒ `retarget.pickModule` — הבורר-לפי-**ייעוד** היחיד בקבוצה (§20-א), מול הבורר-לפי-שם הקיים. ⚠️ `--gate` אדום ואינו רשום במשטרה.
4. **`generator/synth.mjs`** ⇒ `regen.mjs`/`behavior-plan` — §20-ב במנוע: שרשרת עומק-4 מוכחת-בדוגמאות. ירוק, 4 יכולות מוכחות + שקילות-Dart.

## מה לא הצלחתי / מוגבלויות שאני מצהיר עליהן
1. **3 מנועים לא נמדדו בריצה-מלאה, רק בריצת-דילוג** — `golden-harness` · `entity-terms` · `enum-values` (ו-`balagan-run` תלוי באותו שורש). הסיבה: `/home/user/buildsmart` ו-`/home/user/maor-system` אינם בקלון הזה. זה ההיקף המוצהר ב-CLAUDE.md, לא סתירה. הציון שלהם ניתן על קריאת-קוד — **מסומן בגוף כל רשומה**.
2. **`legacy/entities.mjs` לא הורץ בכוונה** — הרצתו משחיתה קובץ מחויב (60⇒0). זו הרשומה היחידה בלי ראיית-הרצה-מלאה, וההימנעות עצמה מתועדת כראיה.
3. **נקודת-החיבור של `dart-twins` משוערת-מקוד ולא נמדדה** — טענתי ש-`runDartBatch` יכול להאיץ את `behavior-plan`, אך לא אימתתי את הצורה הנוכחית של הבורר שם. מסומן במפורש ברשומה.
4. **לא בדקתי אם 4 המנועים של s22=3 יעברו את המשטרה אחרי חיבור.** מיפוי בלבד — אסור לחבר, אסור לבנות.

## מה לא עשיתי (כנדרש)
לא חיברתי · לא בניתי · לא תיקנתי · לא שיניתי קוד · אפס `--write` · אפס commit מחוץ ל-`knowledge/connect/` · לא פתחתי PR · לא נגעתי ב-routines/סשנים · `engine-index.json` לא נגע.
כל הרצה שיצרה קובץ בעץ נוקתה מיד ו-`git status` אומת נקי.
