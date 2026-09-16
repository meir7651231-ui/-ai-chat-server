# 2א · gen + engine + audit + tools + dedup + extract — מיפוי-חיבור

**5/60 מנועים** · חסרים: engine/atlas.mjs, engine/generate.mjs, engine/lib.mjs, gen/build.mjs, gen/detach.mjs, gen/engine.mjs, gen/flutter.mjs, gen/fonts.mjs, gen/index-page.mjs, gen/inventory.mjs, gen/lang.mjs, gen/lenses.mjs, gen/live.mjs, gen/mosad-build.mjs, gen/packs-apply.mjs, gen/pass.mjs, gen/plan.mjs, gen/prove-dart.mjs, gen/prove.mjs, gen/render.mjs, gen/sentence.mjs, gen/shelf.mjs, gen/site.mjs, gen/skin.mjs, gen/spec.mjs, gen/studio.mjs, gen/wizard.mjs, machtzev/audit/diff.mjs, machtzev/audit/features.mjs, machtzev/audit/gen-forge-dart.mjs, machtzev/audit/gen-orig.mjs, machtzev/audit/heal.mjs, machtzev/audit/lib.mjs, machtzev/audit/run.mjs, machtzev/dedup/dedup-atoms.mjs, machtzev/dedup/dedup-cross-dart.mjs, machtzev/dedup/dedup-cross.mjs, machtzev/dedup/dedup-deep.mjs, machtzev/dedup/dedup.mjs, machtzev/dedup/reconcile.mjs, machtzev/extract/components.mjs, machtzev/extract/consts.mjs, machtzev/extract/functions.mjs, machtzev/extract/icons.mjs, machtzev/extract/knowledge.mjs, machtzev/extract/regexes.mjs, machtzev/extract/schema.mjs, machtzev/extract/strings.mjs, machtzev/extract/styles.mjs, machtzev/extract/verticals.mjs, machtzev/tools/box-coverage.mjs, machtzev/tools/dart-test.mjs, machtzev/tools/gen-wiring-doc.mjs, machtzev/tools/promote-auto.mjs, machtzev/tools/refine.mjs

הרשימה נגזרה מהפקודה (לא מיד):

```bash
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' \
  | grep -E '^(gen/[^/]+$|engine/|machtzev/(audit|tools|dedup|extract)/)' > /tmp/my-list.txt
wc -l /tmp/my-list.txt   # 60
```

**פיזור s22:** 3⇒0 · 2⇒0 · 1⇒3 · 0⇒2

| מנוע | s22 | connectAt | תמצית |
|---|---|---|---|
| `machtzev/extract/actions.mjs` (27) | **1** | machtzev/generator/behavior-plan.mjs — פנקס «צרכי-ההתנהגות» של G34 (חתימה+דוגמאות) | סורק tsx/dart בתחומי screens+source ומחלץ כל handler (‏onClick/onChange/onSubmit/onKeyDown/onInput/onPressed/onTap/onLongPress) כאטום-פעולה L2 עם file:line ורמז-שורה |
| `machtzev/extract/terms.mjs` (17) | **1** | machtzev/generator/spec-lang.data.json / nl-lang.data.json — קטלוג-המונחים שהמחולל *כן* קורא (gen/lang.mjs:11 קורא אותם, וגם המחולל הראשי) | מוצא בלוק `TERM_DEFS … = [ … ];` בקבצי-תחום 'flags' ומחלץ ממנו `key`+`def`/`label` ⇒ אטומי-מונח L5, עם מספר-שורה מחושב מהיסט-הבלוק |
| `machtzev/extract/tokens.mjs` (24) | **1** | machtzev/run.mjs:12 (הקיים) — נשאר; נקודת-החיבור-למחולל היחידה הכנה היא הזנת atoms-L0 כשכבת-דאטה ל-`machtzev/generator/atlas.mjs` (buildAtlas cfg.data) | קורא census-<repo>.json, לוקח קבצים שתחומם 'tokens', וסורק כל שורה אחר הצורה `--שם: ערך;` ⇒ אטום-עיצוב אחד פר-שם, עם כל הערכים (ערכות/מצבים) מאוגדים פנימה |
| `machtzev/extract/engines.mjs` (17) | **0** | ∅ | לכל קובץ שתחומו 'engines' ‏(‏lines>0) בונה אטום L6 עם רשימת ה-exports (‏`export function\|const\|class`) |
| `machtzev/extract/flags.mjs` (19) | **0** | ∅ | סורק קבצי-תחום 'flags' ומחלץ דגלי-יכולת מהצורה `{ key: '…', label: '…' }` |

## למה הציון — שורה לכל מנוע

- `machtzev/extract/actions.mjs` **1** — מקור-רעיונות לצרכי-התנהגות, לא מקור-הוכחה. בלי חתימה+דוגמאות הוא אינו יכול להיכנס לבורר של G34
- `machtzev/extract/terms.mjs` **1** — היעד נכון (שפת-המחולל היא דאטה, §19) אך הצינור בין L5 לבין spec-lang.data.json לא קיים, והמקור חסר
- `machtzev/extract/tokens.mjs` **1** — מייצר דאטה שהמחולל *יכול* לצרוך (טוקנים) אבל לא צורך היום, ותלוי במפקד של ריפו שאינו קיים. לא מקרב אפליקציה-עובדת; מקרב את המפה
- `machtzev/extract/engines.mjs` **0** — כפילות-פונקציה עם engine-index.mjs, על מקור שאינו קיים. לא מקרב
- `machtzev/extract/flags.mjs` **0** — לא מקרב. פלט L4 אינו נקרא ע"י שום שלב במחולל, ומקורו (flags של maor) אינו קיים בריפו
