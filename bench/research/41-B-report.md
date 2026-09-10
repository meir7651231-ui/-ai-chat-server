# שורש-41 · חריץ-החיווט הסקלרי (exp-B) — דוח

**מטרה (שורה אחת):** שדה-נגזר שנוקב באטום-מדף **סקלרי** (`sqrt` · `hasCoords`) יגיע **חי** ל-Dart המחולל — ייבוא + קריאה אמיתית — כמו מנוע-רשומה (`boqLineAmount`), בלי שאף פלט אחר ישתנה בבייט.
**פירוק (10 צעדים):** `scratchpad/research/41-B-plan.md` (נכתב לפני נגיעה בקוד).
**חיפוש (הכרעה 23-ד):** `node machtzev/search-record.mjs "sqrt hasCoords שורש ריבועי נקודה קואורדינטות שדה נגזר סקלרי" --choose sqrt` ⇒ `audit/search/2026-09-09-sqrt-has-coords-06d66e40.json`; ‏`--choose hasCoords` ⇒ `…-has-coords-sqrt-a3cf56fb.json`. **לא נוצר אף אטום חדש** — שני האטומים כבר על המדף (`new/dart/sqrt.dart` · `new/dart/has_coords.dart`).

## השורש (בבייטים, לא בפרוזה)
`render-ds.mjs:95-98` — `MAP_ENGINES` סינן `/^Map</` על **הפרמטר-הראשון**. `sqrt(double)` ו-`hasCoords(double?, double?)` נפלו ⇒ סעיף-הנוסחה ירד ל-`compileFormula`, ששָׂם אפס-סובלנות לאותיות לטיניות ⇒ `null` ⇒ שדה-קלט רגיל.
פקודת-ההוכחה (על פלט המנוע **לפני** השינוי): `grep -n "sqrt\|hasCoords" new/dart-gen-bs/gen_app_panuy_ent1.dart` ⇒ **0 שורות**; ובמקומן `DsField(label: gen_app_panuy_ent1_c25, … onChanged: … _v[11] = v)` ו-`…_c26 … _v[12]` (קלט עריך).

## התיקון — שכבת-המנוע בלבד
`machtzev/generator/render-ds.mjs` (+104/−5, `git diff --stat`):
1. **`SCALAR_ENGINES`** — בריכה אחות ל-`MAP_ENGINES`: אותם תנאי-טוהר (`RET_OK` · `he` · `selfContained`), פרמטרים סקלריים בלבד (`num/int/double/String`, גם `?`). ‏**91** אטומים כשירים (מול 10 ב-`MAP_ENGINES`) — `node -e "…listScalarEngines().length"`.
2. **`wireScalar`/`scalarArg`/`splitArgs`** — חיווט רק בנקיבה-מפורשת: ארגומנט = תווית-אחות · אריתמטיקה מעל אחיות · מיפוי `שדה→פרמטר`. פרמטר לא-קשור/טיפוס לא-נתמך ⇒ `null` ⇒ נפילה להתנהגות-הקיימת.
3. **אמת ולא זיוף (§20-ג):** פרמטר `T?` שנקשר לשדה-קלט מקבל `num.tryParse(x)?.toDouble()` — **null כשריק**; `?? 0` היה הופך את `hasCoords` ל"כן" תמיד.
4. **שדה-נגזר כארגומנט משבץ את ביטויו** (‏`_calc` לא נקרא בטופס) — לכן `sqrt` רץ על ביטוי «מרחק בריבוע» עצמו.
5. `compileFormula` פורמטר לקולבק-ערך (ברירת-מחדל ביט-זהה — הוכח ב-AC2).

## הוכחות פר-טענה (פקודה ⇒ פלט שנצפה)
| טענה | פקודה | פלט |
|---|---|---|
| AC1 · `sqrt` חי | `grep -n "^import '../dart/sqrt.dart';" gen_app_panuy_ent1.dart` | שורה 11 |
| AC1 · `sqrt` מעל «מרחק בריבוע» | `grep -n "_live(gen_app_panuy_ent1_c25" …` | ‏`if (true) _live(…_c25, sqrt(((( (num.tryParse(_v[2]…) - … *12321 + … *8649)).toDouble()).toString())` |
| AC1 · `hasCoords` חי | `grep -n "^import '../dart/has_coords.dart';"` / `_live(…_c26` | שורה 10 · `(hasCoords(num.tryParse(_v[2] ?? '')?.toDouble(), num.tryParse(_v[3] ?? '')?.toDouble()) ? …c27 : …c28)` |
| AC1 · לא התנוון לקלט | `grep -c "DsField(label: gen_app_panuy_ent1_c25\|…c26" …` | **0** (לפני: 2) |
| הקריאה גם בכרטיס/CSV/טבלה | `grep -o "sqrt(" … \| wc -l` · אותו הדבר ל-`hasCoords(` | **4** מופעים לכל אחד (טופס `_live` · `DsRecordCard` · CSV · `ForgeDataGrid`) + שורת-ייבוא |
| AC2 · דטרמיניזם | הצנרת רצה פעמיים (לפני/אחרי), `sha256sum` על **1560** קבצים ב-`dart-gen-bs`+`dart-data-bs`+`dart-forge-bs`, `diff` | **בדיוק 2** נבדלים: `gen_app_panuy_ent1.dart` · `auto/gen_app_panuy_ent1_content.dart`. 1560=1560, אפס קבצים נוספו/נמחקו |
| AC4 · אפס עריכה-ביד | `git status --porcelain \| grep -v '^??'` | 9 קבצי-מנוע/חוקה בלבד; **אף `new/**` tracked לא שונה** |
| AC3 · אפס נסיגה | 37 שערי-node, אותה רשימה, לפני (מנוע-HEAD) ואחרי | קודי-יציאה **זהים בכל 37** (`join`+`awk` ⇒ 0 שורות REGRESSED) |
| השער החדש אדום על הרגרסיה האמיתית | `git checkout render-ds.mjs; app-ds -f panuy…; derived-check --gate` | ‏🔴 `rc=1`, 2 ממצאים: «מרחק בקמ»·«יש נקודה» |
| השער החדש ירוק אחרי | אותו הדבר עם המנוע המתוקן | ‏✓ `3/3 … rc=0` |
| הוכחת-ירי מובנית | `node machtzev/generator/derived-check.mjs --selftest` | ‏`🔫 מורעל (3 החלפות): 🔴 אדום כנדרש (3 ממצאים) · נקי: ✓ ירוק (0)` `rc=0` |
| מרשם-השערים עקבי | `truth --gate` | `gates.tsv 54 ≡ police gate() 54` (היה 53≡53) |
| `pins` ירוק | `pins-check --write` ⇒ `pins-check` | `rc=0` (134 קבצים מקובעים) |
| `index-complete` ירוק | `node machtzev/index-check.mjs` | `✓ 127/196 · חוב 69/70 (רק-יורד)` `rc=0` |
| איזון-סוגריים בפלט | סורק-מודע-מחרוזות על הקובץ | `{"(":0,"[":0,"{":0} neg=0` (זהה לבסיס) |

## השער החדש (AC3-ב · L80 · חוק D5 "הַצֵּב שער")
`machtzev/generator/derived-check.mjs` — שם חדש (`grep -c "^derived\t" gates.tsv` ⇒ 0 לפני הרישום, L2026-09-04-ratchet-down). שלוש בדיקות-בייטים לכל `שדה = fn(…)` בכל `specs-ds/*.txt`: (1) `fn` קיים באטלס · (2) בפלט המרחב יש **ייבוא-האטום + קריאה `fn(`** · (3) התווית אינה `DsField(label: <קבוע>,` עריך (**זהו** מנגנון-הניוון השקט).
רישום באותו שינוי: `gates.tsv:15` · `police.mjs:140` (`gate('derived', …)`) · `ship.mjs:40` (מיד אחרי `runRegen(node, REGEN)` — L80: שער-פלט-regen רץ בשלב-ה-regen, לא רק בקומיט) · `INDEX.md` · `pins.sha256` · `TRUTH.md`/`CLAUDE.md` (‏`truth --write`).

## לקח (M4) · goal-card
`machtzev/LEARNINGS.md` — **L107** (‏`GATE: derived` · `ANTIPATTERN: DsField\(label: gen_app_panuy_ent1_c2[56],` — לא תופס אף קובץ ב-`new/` אחרי התיקון): חריץ-חיווט שנסגר על **צורת-פרמטר** בולע יכולת בשקט; `T?` מקבל את האמת; שדה-נגזר כארגומנט משבץ ביטוי; כל חריץ חדש נולד עם שער-בייטים.
`machtzev/audit/goals/gen_app_panuy_ent1.json` — כרטיס-מטרה (מודלים `sqrt,hasCoords,boqLineAmount` · אטומים `DsRecordCard,ForgeDataGrid,_live` · 4 מבחני-קבלה מספריים). **התמונה `gen_app_panuy_ent1.png` היא מציין-מקום 480×320 שנוצר ב-node — לא צילום-רנדר אמיתי** (אין Flutter במכונה).

## מוכח / לא-מוכח (D3)
**מוכח:** AC1 (הבייטים לעיל) · AC2 (‏1560 קבצים, 2 נבדלים) · AC3-א (37 שערים, קודי-יציאה זהים) · AC3-ב (השער אדום על הרגרסיה האמיתית + על הרעלה, ירוק על נקי) · AC4 (‏git status).
**לא-מוכח (ואומר זאת מפורשות):**
1. **הקוד המחולל לא הודר ולא רונדר.** אין Dart/Flutter במכונה — `synth` מחזיר 🟡 `אין בינארי Dart`, ו-`genverify`/`appgen` אדומים **גם לפני וגם אחרי** (`0/287 מסכים רונדרו`, `flutter test 0 passed`). בדקתי איזון-סוגריים ונכונות-טיפוסים בעין; **לא** הרצתי `dart analyze`. הטענה "מתקמפל" — השערה.
2. **`node machtzev/one.mjs --genmax` לא הורץ** — הוא מריץ את `REGEN` כולה *כולל* `tighten-types --record --apply` שהוגדר כשבור-והרסני. במקומו הרצתי `REGEN` **מיובאת מ-`regen.mjs`** פרט לשלב-tighten (‏36/37 שלבים, `FAILS=0`) — אותה רשימה, לא עותק.
3. **5 שערים אדומים/צהובים לפני **וגם** אחרי (סביבה, לא רגרסיה):** `freeref`·`deeppurity` = `🟡 tool=typescript חסר`; `synth` = `🟡 tool=dart`; `appgen`·`genverify` = דורשים flutter. `learn` אדום ב-9 הפרות **זהות** לפני ואחרי (‏`ref blob … לא נמצא` — clone רדוד); L107 שלי לא הוסיף ולו הפרה אחת.
4. **שערי-push שלא הורצו:** `boxes` · `goldenharness` · `mutation-dart` · `audit-gates` · `selftest` · `coverage`(הורץ, ירוק) · `balaganrun` — דורשים Dart/git-clone/playwright.
5. **קימוט שנתפס אגב-אורחא (לא תוקן):** `gen-verify.mjs --gate` **כותב** את `gen-verify-report.json` בזמן ריצה, ו-`truth` קורא אותו ⇒ הרצת `genverify` לפני `truth` מאדימה את `truth` שלא-בצדק. זו הפרת §0.5 של PROTOCOL ("שער לא כותב"), קיימת מראש; עקפתי אותה בהחזרת הקובץ לפני כל מדידה.
6. **היקף השער `derived` מוצהר:** שדות-ישות שנוקבים באטום-מדף. חלקיקים נשמרים בשער `particles` (0 לא-מחווטים) — לא הרחבתי אותו.
