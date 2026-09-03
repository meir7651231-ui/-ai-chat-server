# 🗂️ machtzev · קטלוג-הכלים (INDEX)

> מפת-הניווט של המפעל. הכלים **מקובצים פיזית** לתת-תיקיות לפי-תפקיד
> (`purity/` · `dedup/` · `census/` · `mahulal/` · `tools/`); כניסות-העל והשערים-הנעולים
> נשארים בשורש-`machtzev/`. מקור-האמת לתפקיד = כותרת-הקובץ · לשערים = `gates.tsv`.
> מפרט קובץ-קובץ מלא: `MPRAT.md` בשורש.

## 🚪 כניסות-על (entrypoints)
| קובץ | תפקיד |
|------|-------|
| `one.mjs` | ⚡ **המנוע-האחד** — לוח-האם: רענון-מקור→פירוק-מסכים→דדופ→מונחים→הרכבה→טוהר→משטרה→`ONE-STATUS.md`. `--full`=משטרה-מלאה. |
| `run.mjs` | המפעיל פר-גל: מפקד←מחלצים←זיקוק←משטרה. `--fast`=משטרה בלבד. |
| `police.mjs` | 🚨 **המשטרה המאוחדת** (ran-ledger). `--fast`=11 שערי-Node · מלא=+selftest+mutation. |
| `census.mjs` | מפקד-המחצבה (census חוצה-שכבות). |
| `root.mjs` | 🌳 שורש-העץ-הנמדד (c3): `MACHTZEV_ROOT` ⇒ כלים מודדים עץ אחר; `GEN_OUT` ⇒ פלט-מחולל זמני. כל fs-path של שער עובר כאן. |
| `dart-bin.mjs` · `lib-ts.mjs` | פותרי-כלים משותפים (Dart · typescript) — אין-כלי ⇒ `exit 2 tool=<שם>` (L34). |
| `verify-independent.mjs` | 🔍 **המאמת-העצמאי** (PROTOCOL §5.2): כלי-משטרה מ-tag ידוע-טוב על HEAD · ראצ׳ט-כיוון פר-commit · הוכחת-ירי · שתי משטרות. עד, לא חומה. |
| `census/import-graph.mjs` | 🕸️ גרף-imports סטטי ל-`police --inc` (שלב 1): דיף ⇒ דיף+צרכנים-טרנזיטיביים (+זוג בדיקה/חוזה). `import()` דינמי / קובץ-חוץ / >50 ⇒ unknown ⇒ המשטרה מריצה מלא (fail-closed). |
| `../.github/workflows/police.yml` | 🛡️ CI-עד (שלב 3 · §7.3): non-required. G1 pins · G9 ראצ׳ט מול event.before/סמן · G8 Protocol-Ran על הטווח + dart analyze · G3+G7 truth/wiring ⇒ diff ריק · G2+G10 משטרה מלאה (צהוב=אדום) + מס · G0 מאמת מכלי הסמן (ללא קידום). ערוץ = job summary. |
| `learn-check.mjs` | 📚 שער `learn` (§8 · שלב 4): parity (GATE: לכל לקח, id מוכר) · antipattern-scan (regex לא תופס אף קובץ ב-new/) · learn-on-retry (טיוטת-M4: regex תופס blob-לפני, לא אחרי, לא ליטרל, תופס fixture ב-`selftest-fixtures/learn/`) · stuck-loop (3 כשלים רצופים ⇒ בעלים). |
| `learn-draft.mjs` | 📝 מנוע-M4: `--record <gates> --stage <files>` ⇒ רשומות ב-`audit/retry.jsonl` (gate·path·sha·blob-before) · `--stage` בלבד ⇒ טיוטת `## L<תאריך>-<gate>-<sha6>` ב-LEARNINGS.md ל-retry לא-פתור + סימון resolved. |
| `pretool-selftest.mjs` | 🪤 הוכחת-ירי ל-`.claude/hooks/pre-tool.sh` (שלב 2 · §6): כל שורה ב-`selftest-fixtures/pretool.tsv` מוזנת ל-hook כ-PreToolUse; חסום=2 · עובר=0. לקח חדש = שורה. |
| `selftest-fixtures/` | fixtures של `police-selftest.mjs` — **לא נעולים**: לקח חדש = fixture חדש בלי pins-write. |
| `BUILDSMART-PROTOCOL-MAP.md` | 🗺️ מפת-הפרוטוקול של buildsmart (4 שכבות · 99 שערים · ערכת-אורקסטרטור · סטיות) — חומר-הגלם שממנו נגזר `PROTOCOL.md` (v1→v4). קריאה בלבד, לא הנחיה. |
| `PROTOCOL.md` · `RED-TEAM-PROTOCOL.md` | תוכנית-האכיפה (v4) ויומן-השבירה (2 סבבים, 133 ממצאים). |
| `compose-engine.mjs` | 🧩 קומפוזר-דטרמיניסטי (הכרעה 23-ג · §20-ד): חלקיק+נוסחה ⇒ פעולות-הצגה ⇒ אטום-אמיתי-הכי-טוב-לייעוד; טבלת-ATOM + FAKERS (מזייפים חסומים). טרם שער — `compose-determinism` מוצע. |
| `compose-engine-report.md` · `compose-compare.md` | פלט-המנוע על 15 החלקיקים · השוואה מול 3 סוכנים (המגן עבד 100%; הסוכן מקסימלי ב-7/15). |
| `LAWS-MAP.md` | מפת כל חוקי-המחצב (כולל 23-ב/23-ג · מגן-בלי-סטיות · חוזה-הדאטה). |

## 🔒 שערים נעולי-חתימה (pins.sha256 — לא-מוזזים · שינוי⇒`pins-check.mjs --write`)
`police.mjs` · `wiring-check.mjs` · `contract-check.mjs` · `quarry-check.mjs` ·
`police-selftest.mjs` · `mutation-check.mjs` · `pins-check.mjs` · `gates.tsv` ·
`LAW.md` · `CLAUDE.md` · `AGENT-CODE.md`

| שער (gates.tsv) | קובץ | בודק |
|---|---|---|
| wiring | `wiring-check.mjs` | חוקי-החשמלאי: אטום לא מייבא אטום, קופסה לא קופסה, לוח רק קופסאות |
| contract | `contract-check.mjs` | לכל אטום חוזה+בדיקה ירוקה + סריקת-PII (חוק-6) |
| quarry | `quarry-check.mjs` | כל טיוטה עם מוצא + parse |
| pins | `pins-check.mjs` | חתימות-hash על החוקה והמשטרה |
| selftest | `police-selftest.mjs` | כל חוק יורה על fixture מורעל + ביקורת-שלילית |
| mutation | `mutation-check.mjs` | אדום-על-חלול, ירוק-על-אמיתי |
| freeref | `emit/free-ref-scan.mjs` | אפס מזהה לא-מוגדר (חוק-1) |
| assembly | `assemble/box-audit.mjs` | כל חוט-מתוכנן מחווט — אפס אובדן-יכולת |
| datapurity | `data-purity-check.mjs` | אפס דאטה-צרובה במנגנון (הכרעה 16) |
| deeppurity | `deep-purity-scan.mjs` | אפס דאטה-חדשה — גם קבועים ושמות-דומיין (הכרעה 19) |
| synth | `generator/synth.mjs` | יכולת-מוזמנת שהוכחה נשארת מוכחת-חי |

## 🧼 טוהר · המרה-מחדש (הכרעות 16+19)
| קובץ | תפקיד |
|------|-------|
| `purify.mjs` | מכונת-הטיהור — מחלצת דאטה-צרובה ממנוע לאטום-דאטה. |
| `purify-engine.mjs` | מנוע-הטיהור (הכרעה 19 · "תשדרג"). `--all`. |
| `purify-hard.mjs` | מנוע-הקשיחים — object-keys/defaults/module-helpers ⇒ שקע-מושחל. `--run N`. |
| `ast-purify.mjs` | 🎯 דה-הרדקוד Dart-נייטיב (analyzer דרך `carve/ast_dehardcode.dart`) → `dart-data-*/…-terms.dart` + חיווט-צרכנים. **מייצר את הטוהר-אחרי-המרה.** |
| `ast-purify-interp.mjs` | וריאנט-interp של אותו מנהל-AST. |
| `dehardcode.mjs` | כלי-דה-הרדקוד — מחליף שמות-צרובים במחרוזת. |
| `const-normalize.mjs` | ממיר אטום-const-דאטה לפונקציה. |
| `data-purity-check.mjs` | 🧪 שער-טוהר (הכרעה 16, baseline-ratchet). `--report`/`--gate`/`--baseline`. |
| `purity-data.mjs` | סורק clean/data/mixed. `--gate`/`--write`. |
| `deep-purity-scan.mjs` | 🔬 סורק-טוהר-עומק (הכרעה 19). `--gate`. |
| `gen-data-dart.mjs` | ממיר אטום-const-JS ל-Dart מכני + זהב jsonEncode≡. |
| `reconvert-data.mjs` | 🔁 פולט תאום-Dart מוקלד לכל אטום-דאטה-JS ל-`dart-data-maor`. |
| `independence-check.mjs` | מגן-עצמאות — מערכת-אחת-שיכולה-לרוץ-לבד. |

## 🔍 דדופ (הכרעה 5)
`dedup.mjs` (הכרעת-כפילויות) · `dedup-atoms.mjs` (מדף-חוזה) · `dedup-deep.mjs` (רזולוציית-פירוק-מלא) ·
`dedup-cross.mjs` (חוצה-מערכות מאור↔בנייה-חכמה) · `dedup-cross-dart.mjs` (חוצה-ענפים Dart↔Dart) ·
`reconcile.mjs` (משוואות-השלמות).

## 📊 מפקד · אינדקס
`atom-census.mjs` (census אטומי-UI) · `atom-index.mjs` (🔴 אינדקס-האמת → `generator/atom-index.json`) ·
`logic-census.mjs` (census מנועי-לוגיקה).

## 🏗️ מחולל · קבלה (הכרעות 17–23)
`generator-ratchet.mjs` (נועל יכולות-המחולל) · `spec-acceptance.mjs` (§22 קבלה: אפיון⇒מערכת-מלאה) ·
`nl-smoke.mjs` (רצפת-§22: משפט-חופשי לא-קורס) · `nl-quality.mjs` (איכות-חילוץ).
> ליבת-המחולל עצמה: `generator/` (28 קבצים).

## 🧰 כלֵי-עזר
`box-coverage.mjs` (מד-מוכנות-קופסאות) · `gen-wiring-doc.mjs` (מחולל `WIRING.md`) ·
`promote-auto.mjs` (קידום-אוטומטי · צילום/Golden) · `refine.mjs` (זיקוק מנועים-תאומים) ·
`dart-test.mjs` (מריץ בדיקות-Dart) · `reconcile.mjs`.

## 📁 תת-תיקיות (כבר-מקובצות)
| תיקייה | # | תפקיד |
|--------|---|-------|
| `generator/` | 28 | ליבת-המחולל: `app-ds` · `render-ds` · `entity` · `nl-spec` · `synth` · `genesis-gen` + `*.json` דאטה-אטומים + `acceptance-space.txt`. |
| `assemble/` | 16 | הרכבה: `shelf-lift` · `data-lift` · `gen-manifest` · `gen-screen` · `board-gen` · `box-audit`. |
| `extract/` | 15 | מחלצי-L2: כל לחיצה/פעולה ממסך-המקור. |
| `emit/` | 14 | JS↔Dart: `ast-js-to-dart` · `js-to-dart` · `dart-to-js` · `parity-*` · `free-ref-scan`. |
| `carve/` | 9 | חצב-AST: `ast_dehardcode.dart` · `screen-decomp` · `screen-lift` · `widget-dedup`. |
| `behavioral/` | 4 | זהב-התנהגות: `run.mjs` (AppStore · golden 14/14). |

## 📄 קבצי-לוויין
`gates.tsv` (מרשם-שערים) · `pins.sha256` (חתימות) · `atom-index.json`/`*.json` (אינדקסים) ·
`ONE-STATUS.md` (פלט המנוע-האחד).
