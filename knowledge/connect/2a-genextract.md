# 2א · gen + engine + audit + tools + dedup + extract — מיפוי-חיבור

**15/60 מנועים** · חסרים: engine/atlas.mjs, engine/generate.mjs, engine/lib.mjs, gen/build.mjs, gen/detach.mjs, gen/engine.mjs, gen/flutter.mjs, gen/fonts.mjs, gen/index-page.mjs, gen/inventory.mjs, gen/lang.mjs, gen/lenses.mjs, gen/live.mjs, gen/mosad-build.mjs, gen/packs-apply.mjs, gen/pass.mjs, gen/plan.mjs, gen/prove-dart.mjs, gen/prove.mjs, gen/render.mjs, gen/sentence.mjs, gen/shelf.mjs, gen/site.mjs, gen/skin.mjs, gen/spec.mjs, gen/studio.mjs, gen/wizard.mjs, machtzev/audit/diff.mjs, machtzev/audit/features.mjs, machtzev/audit/gen-forge-dart.mjs, machtzev/audit/gen-orig.mjs, machtzev/audit/heal.mjs, machtzev/audit/lib.mjs, machtzev/audit/run.mjs, machtzev/dedup/dedup-atoms.mjs, machtzev/dedup/dedup-cross-dart.mjs, machtzev/dedup/dedup-cross.mjs, machtzev/dedup/dedup-deep.mjs, machtzev/dedup/dedup.mjs, machtzev/dedup/reconcile.mjs, machtzev/tools/box-coverage.mjs, machtzev/tools/dart-test.mjs, machtzev/tools/gen-wiring-doc.mjs, machtzev/tools/promote-auto.mjs, machtzev/tools/refine.mjs

הרשימה נגזרה מהפקודה (לא מיד):

```bash
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' \
  | grep -E '^(gen/[^/]+$|engine/|machtzev/(audit|tools|dedup|extract)/)' > /tmp/my-list.txt
wc -l /tmp/my-list.txt   # 60
```

**פיזור s22:** 3⇒0 · 2⇒2 · 1⇒6 · 0⇒7

| מנוע | s22 | connectAt | תמצית |
|---|---|---|---|
| `machtzev/extract/functions.mjs` (71) | **2** | machtzev/generator/logic-census.mjs / auto-logic.catalog — קטלוג-הלוגיקה שהבורר של G34/G18-19 מחפש בו לפי חתימה | פירוק-מקסימום: כל פונקציה בקובץ engines/source ⇒ אטום L6b עם **גבולות-שורה מדויקים** (start-end), אורך, ורשימת-מי-היא-קוראת (עד 12 שמות, אחרי סינון 100+ מובנים) |
| `machtzev/extract/schema.mjs` (22) | **2** | ‏`machtzev/generator/app-ds.mjs` — דקדוק-האפיון (`ישות X עם שדה*, סכום(0..N), מצב{א\|ב}`) · `entity-slugs.json` | סורק **רק** `types/domain.ts` או `domain/*.dart` ומחלץ כל שדה בכל ישות ⇒ אטום L10 עם entity · name · optional · type · file:line |
| `machtzev/extract/actions.mjs` (27) | **1** | machtzev/generator/behavior-plan.mjs — פנקס «צרכי-ההתנהגות» של G34 (חתימה+דוגמאות) | סורק tsx/dart בתחומי screens+source ומחלץ כל handler (‏onClick/onChange/onSubmit/onKeyDown/onInput/onPressed/onTap/onLongPress) כאטום-פעולה L2 עם file:line ורמז-שורה |
| `machtzev/extract/regexes.mjs` (16) | **1** | ‏`machtzev/generator/spec-lang.data.json` — הדקדוק של המחולל הוא היום אוסף תבניות בדאטה | מחלץ כל ליטרל-regex באורך ≥6 מקובצי ts/mjs בתחום 'engines' ⇒ אטום L12 עם pattern (עד 80 תווים), flags ו-file:line |
| `machtzev/extract/strings.mjs` (20) | **1** | machtzev/generator/spec-lang.data.json (שכבת-הדקדוק של המחולל) | סורק tsx/ts/dart בתחומי screens+source+actions+engines ומחלץ כל מחרוזת שיש בה אות עברית (‏[֐-׿] בתוך ' " `) ⇒ אטום L5b עם 60 תווים ו-file:line |
| `machtzev/extract/terms.mjs` (17) | **1** | machtzev/generator/spec-lang.data.json / nl-lang.data.json — קטלוג-המונחים שהמחולל *כן* קורא (gen/lang.mjs:11 קורא אותם, וגם המחולל הראשי) | מוצא בלוק `TERM_DEFS … = [ … ];` בקבצי-תחום 'flags' ומחלץ ממנו `key`+`def`/`label` ⇒ אטומי-מונח L5, עם מספר-שורה מחושב מהיסט-הבלוק |
| `machtzev/extract/tokens.mjs` (24) | **1** | machtzev/run.mjs:12 (הקיים) — נשאר; נקודת-החיבור-למחולל היחידה הכנה היא הזנת atoms-L0 כשכבת-דאטה ל-`machtzev/generator/atlas.mjs` (buildAtlas cfg.data) | קורא census-<repo>.json, לוקח קבצים שתחומם 'tokens', וסורק כל שורה אחר הצורה `--שם: ערך;` ⇒ אטום-עיצוב אחד פר-שם, עם כל הערכים (ערכות/מצבים) מאוגדים פנימה |
| `machtzev/extract/verticals.mjs` (27) | **1** | ‏`machtzev/generator/auto-skin.mjs` (‏הכרעה-25 — 26 תפקידי-skin שהמנוע בוחר) + `gen/skin.data.json` | מוצא קובץ בשם `verticalPacks.ts`, חותך את `VERTICAL_PACKS = [ … ]`, ומפצל אותו **לפי מיקומי-`id:`** (לא לפי סוגריים) ⇒ עמיד להערות בין בלוקים |
| `machtzev/extract/components.mjs` (30) | **0** | ∅ | שני מעברים: (1) אוסף שמות-רכיבים מיוצאים מכל tsx/dart (‏`export function X` · `export const X` · `class X extends StatelessWidget\|StatefulWidget\|ConsumerWidget\|…`), (2) לכל קובץ בונה קבוצת-שימוש `uses` ע"י חיפוש `<X` או `X(` של שמות שמוגדרים בקובץ **אחר** |
| `machtzev/extract/consts.mjs` (24) | **0** | ∅ | מחפש 4 תבניות של «מספר-קסם» בקוד: השהיית-setTimeout · קבוע-בשם-תקרה (‏CAP/MAX/MIN/LIMIT/SIZE/COUNT/THRESHOLD) · `slice(0,N)` · השוואה ל-≥3 ספרות ⇒ אטומי L9 «החלטות-עסקיות קבורות» |
| `machtzev/extract/engines.mjs` (17) | **0** | ∅ | לכל קובץ שתחומו 'engines' ‏(‏lines>0) בונה אטום L6 עם רשימת ה-exports (‏`export function\|const\|class`) |
| `machtzev/extract/flags.mjs` (19) | **0** | ∅ | סורק קבצי-תחום 'flags' ומחלץ דגלי-יכולת מהצורה `{ key: '…', label: '…' }` |
| `machtzev/extract/icons.mjs` (16) | **0** | ‏`machtzev/generator/web-shell.mjs` — ‏G52 גוזר זהות-אפליקציה (‏favicon/manifest) מ«אימוג'י-ממשק» שבקוד-המחולל | סופר כל אימוג'י (‏\p{Extended_Pictographic}) בקבצי tsx/ts/dart של 4 תחומים ⇒ אטום L11 אחד פר-סמל עם מונה-שימושים |
| `machtzev/extract/knowledge.mjs` (16) | **0** | ∅ | אטום פר-מסמך-md בתחום 'knowledge': סוג (מתוך 22 קידומות-שם), תאריך מהשם, מספר-שורות, וכותרת-H1 מ-400 התווים הראשונים |
| `machtzev/extract/styles.mjs` (25) | **0** | ‏`gen/skin.mjs` / `machtzev/generator/ds-forge.mjs` — שכבת-העור שקוראת זרע-צבע כדאטה | סורק **רק** קבצי `.tsx` ומחלץ כל זוג מאפיין:ערך מתוך `style={{…}}` ⇒ אטום L0b מאוגד (אטום אחד לכל זוג, עם `count` ועד 5 מיקומים) |

## למה הציון — שורה לכל מנוע

- `machtzev/extract/functions.mjs` **2** — המנוע היחיד ב-extract/ שמייצר בדיוק את מה שהבורר-בהוכחה צורך (פונקציה טהורה + חתימה + טווח). חסר לו רק מקור — ולכן 2, לא 3
- `machtzev/extract/schema.mjs` **2** — התאמת-צורה כמעט-מלאה לשפת-הספק של המחולל, וחסר לו מנוע-תרגום אחד קצר. אבל המקור (‏domain.ts של maor) אינו קיים — לכן 2 ולא 3
- `machtzev/extract/actions.mjs` **1** — מקור-רעיונות לצרכי-התנהגות, לא מקור-הוכחה. בלי חתימה+דוגמאות הוא אינו יכול להיכנס לבורר של G34
- `machtzev/extract/regexes.mjs` **1** — מקור-רעיונות לדקדוק, אבל בדיוק הסוג שהכרעה-30 פסלה (התאמה-לפי-מחרוזת במקום הוכחה-בריצה)
- `machtzev/extract/strings.mjs` **1** — רעיון-שער נכון (עברית=דאטה) על מקור שאינו כאן, וכפילות עם שערים שכבר רצים. מקרב אמון, לא אפליקציה
- `machtzev/extract/terms.mjs` **1** — היעד נכון (שפת-המחולל היא דאטה, §19) אך הצינור בין L5 לבין spec-lang.data.json לא קיים, והמקור חסר
- `machtzev/extract/tokens.mjs` **1** — מייצר דאטה שהמחולל *יכול* לצרוך (טוקנים) אבל לא צורך היום, ותלוי במפקד של ריפו שאינו קיים. לא מקרב אפליקציה-עובדת; מקרב את המפה
- `machtzev/extract/verticals.mjs` **1** — התאמת-צורה טובה ל-auto-skin, אבל העור כבר נבחר ע"י מנוע (G12-13) ומקור-הוורטיקלים אינו קיים
- `machtzev/extract/components.mjs` **0** — כפילות-פונקציה נחותה מול אינדקס-האטומים הקיים, ועל מקור חסר. לא מקרב
- `machtzev/extract/consts.mjs` **0** — לא מקרב. אין נקודה בצינור-המחולל שמקבלת «מספר-קסם» כקלט
- `machtzev/extract/engines.mjs` **0** — כפילות-פונקציה עם engine-index.mjs, על מקור שאינו קיים. לא מקרב
- `machtzev/extract/flags.mjs` **0** — לא מקרב. פלט L4 אינו נקרא ע"י שום שלב במחולל, ומקורו (flags של maor) אינו קיים בריפו
- `machtzev/extract/icons.mjs` **0** — התפקיד שלו כבר ממולא בתוך המחולל, על המקור הנכון. לא מקרב
- `machtzev/extract/knowledge.mjs` **0** — לא מקרב, ואומר זאת במפורש: 22 קידומות-שם אינן ידע
- `machtzev/extract/styles.mjs` **0** — עיוור ל-Dart, ולכן עיוור לכל מה שהמחולל פולט. השער המקביל (look) כבר רץ
