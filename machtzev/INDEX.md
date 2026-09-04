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
| `search-record.mjs` · `audit/search/` | 🔎 הדרך צעד 2–3 (שלב 9): חיפוש-כלי באורקל-המאוחד ⇒ רשומה חתומה (מועמדים · ציונים · הכרעה). `--choose` רק מועמד · `--none` מנומק ומזכיר מועמדים-חזקים. |
| `goal-card.mjs` · `audit/goals/` | 🎯 כרטיס-מטרה (שלב 9): הסוכן מזין מטרה·מודלים·אטומים·קבלה + תמונת-רנדר; נחתם עם sha-מסך ו-sha-תמונה. `--refresh` אחרי שינוי-מסך. |
| `goal-proof-check.mjs` | 📷 שער `goal-proof` ב-pre-commit: מסך/לוח שנוסף/השתנה (מזוהה לפי Scaffold, לא לפי תיקייה · L50) ⇒ כרטיס תקף + תמונה אמיתית + כל model/atom בקוד. |
| `search-proof-check.mjs` | 🧭 שער `search-proof` ב-pre-commit: אטום/קופסה חדשים ⇒ רשומת-חיפוש תקפה (sig · אורקל נוכחי · none). |
| `cross-source-check.mjs` | 🔎 שער `cross-source` ב-pre-commit (23-ד): אטום חדש ששמו כבר קיים באותה שפה במקור אחר ⇒ אדום ("אין = לא-חיפשת"); תאום JS↔Dart ⇒ ℹ️. |
| `wave-partition.mjs` | 🌊 שלב 7: קבצי-יעד ⇒ תאים דיסיונקטיים לפי רדיוס-פגיעה (import-graph) ⇒ גלים ≤10 (L20); תא-חורג מוצהר, לא נחתך. `Wave: k/N` ב-commit-msg מאומת. |
| `audit-gates.mjs` | 🧪 שער `audit-gates` (G5 · שלב 8): worktree זמני + hooksPath ⇒ 9 הפרות מוזרעות ⇒ `git commit` נחסם · ביקורת-שלילית עוברת עם Protocol-Ran. |
| `mutation-dart-check.mjs` | 🧬 שער `mutation-dart` (שלב 8 · L11): אטום-Dart מוחלל type-preserving ⇒ הבדיקה חייבת להאדים (sandbox, 20s). דגימה 12/יום ב-push · `--all` ב-CI · אין Dart ⇒ צהוב. |
| `allow-check.mjs` | 🎫 trailers `Allow:` (§6 · שלב 6): `Allow: <kind>[:<scope>] <L-id|הכרעה-N>` — kinds pins-write · baseline · floor · corpus · yellow-push · push-main. commit-msg: פורמט + כיסוי-החלשות (מ-pre-commit) + pins-write לקובצי-חוקה + `DoD:` בשם-בדיקה-ב-diff. pre-push: push-main/yellow-push ב-tip, ראצ׳ט פר-commit מכוסה-Allow. pre-tool: push-main מ-HEAD. |
| `no-fakers-check.mjs` · `no-fakers-baseline.json` | 🛡️ שער `no-fakers` (שלב 5): FAKERS מ-compose-engine (SSOT) ⇒ PascalCase ⇒ סריקת gen/boards/screens; חוב 3 קבצים (gen_charts · gen_dash11 · gen_feedback10) רק-יורד. |
| `index-check.mjs` · `index-baseline.json` | 📇 שער `index-complete` (M3): סקריפט בלי שורה ב-INDEX.md ⇒ אדום; חוב-קיים ברשימה רק-יורדת. |
| `atom-count-check.mjs` · `atom-count-baseline.json` | 🔢 שער `atom-count`: מספר-אטומים לאזור new/* לא יורד; מחיקה מכוונת = `--write` + ציון ב-commit. |
| `learn-baseline.json` · `pretool-fixtures-baseline.json` · `mutation-dart-baseline.json` | 📈 רצפות סבב-3: מספר-לקחים (grow) · מספר-fixtures של pre-tool (grow) · unparsed של מוטציה-Dart (shrink). |
| `selftest-coverage-baseline.json` | 📈 רצפת-הזוגות-המוכחים של `police-selftest` (grow; `--floor` מעלה). |
| `learn-check.mjs` | 📚 שער `learn` (§8 · שלב 4): parity (GATE: לכל לקח, id מוכר) · antipattern-scan (regex לא תופס אף קובץ ב-new/) · learn-on-retry (טיוטת-M4: regex תופס blob-לפני, לא אחרי, לא ליטרל, תופס fixture ב-`selftest-fixtures/learn/`) · stuck-loop (3 כשלים רצופים ⇒ בעלים). |
| `learn-draft.mjs` | 📝 מנוע-M4: `--record <gates> --stage <files>` ⇒ רשומות ב-`audit/retry.jsonl` (gate·path·sha·blob-before) · `--stage` בלבד ⇒ טיוטת `## L<תאריך>-<gate>-<sha6>` ב-LEARNINGS.md ל-retry לא-פתור + סימון resolved. |
| `pretool-selftest.mjs` | 🪤 הוכחת-ירי ל-`.claude/hooks/pre-tool.sh` (שלב 2 · §6): כל שורה ב-`selftest-fixtures/pretool.tsv` מוזנת ל-hook כ-PreToolUse; חסום=2 · עובר=0. לקח חדש = שורה. |
| `selftest-fixtures/` | fixtures של `police-selftest.mjs` — **לא נעולים**: לקח חדש = fixture חדש בלי pins-write. |
| `BUILDSMART-PROTOCOL-MAP.md` | 🗺️ מפת-הפרוטוקול של buildsmart (4 שכבות · 99 שערים · ערכת-אורקסטרטור · סטיות) — חומר-הגלם שממנו נגזר `PROTOCOL.md` (v1→v4). קריאה בלבד, לא הנחיה. |
| `PROTOCOL.md` · `RED-TEAM-PROTOCOL.md` | תוכנית-האכיפה (v4) ויומן-השבירה (2 סבבים, 133 ממצאים). |
| `generator/op-census.mjs` · `generator/ops-map.json` · `ops-census-report.md` | 🧭 סנסוס-פעולות-היסוד (GENMAX·G1): 1950 אטומים (אורקל+דאטה) ⇒ op מצורת-שקעים/חתימה (§20-ד) · zero=מזייף אוטומטי · שער `opcensus` |
| `generator/shape-ops.mjs` · `shape-ops.json` · `golden-modules.json` | 🧬 סכמה⇒פעולות-יסוד (GENMAX·G2): 54 ישויות/492 שדות ⇒ ops מצורת-הטיפוס בלבד · כיסוי חלקיקי-הזהב · שער `shapeops` |
| `generator/cover.mjs` · `cover-report.md` | 🧩 כיסוי-שקעים=הרכבה (GENMAX·G3): בקשה {op,need,goal} ⇒ אטומים מכסים (תצוגה: שקעים+דרגת-מדף+מטרה; לוגיקה: מטרה-מכותרת-האטום IDF) · שער `cover` = שחזור ATOM-ביד |
| `generator/quarry-golden.mjs` · `golden-fragments.json` · `golden-fragments-report.md` | ⛏️ חציבת-הזהב (GENMAX·G4a): 9 מודולי-SchoolOS ⇒ שברים לפי סמני-הבנאים (═══/───/class/builder/member) + חוקי-דבק (@override · כותרת⇒קוד); לכל שבר defs/atomsUsed/ops/imports, ול-build/builder גם `prelude`+`callSites` (G5a) · round-trip ביט-לביט · שער `goldquarry` |
| `generator/render-module.mjs` · `gen_*_subset.dart` · `gen_composite_*.dart` | 🧬 הרכבה-מהקטלוג (GENMAX·G4): חלקיקים/אטומים ⇒ שברים ⇒ סגירת-תלויות (defs · ווידג׳ט⇒כל-שבריו · State⇒ווידג׳ט · חיבורי-מסגרת · build-כשמלא) ⇒ מודול-Dart; מצבים minimal (build סינתטי) / compose (המסך-השלם) · **G8c** `assembleByOps`/`--entity-ops E` (זריעה לפי G2-ops של הישות מ-frag-ops, לא חלקיקי-יד) · **G4b** `assembleMulti --modules a,b` (איחוד-imports · dedupe · הרמת-State · סיומת-מודול להתנגשויות) · **G5a** `socketPlan` (פתיח-הזהב + אתרי-קריאה ⇒ שקעי-בונים, פנימי/מקום-שמור) · שער `rendermodule` |
| `generator/golden-harness.mjs` · `golden-harness-report.json` · `render-module-baseline.json` | 🏁 רתמת-הזהב (GENMAX·G4): המודול-המורכב-מחדש מוחלף במראה-buildsmart ⇒ `flutter test` של בדיקות-הזהב המקוריות ⇒ שחזור; golden-regenerated N/9 · שער `goldenharness` (push) |
| `generator/gen-verify.mjs` · `gen-verify-report.json` · `gen-verify-baseline.json` | 🔎 אימות-בפועל של פלטי-המחולל (GENMAX·G5b): בדיקת-widget מחוללת למראה-buildsmart לכל gen_*.dart עם מסך — pump · אפס-חריגות · DsScaffold · אטומי-תצוגה שרונדרו · שער `genverify` (push) |
| `generator/retarget.mjs` · `gen_retarget_*.dart` | 🎯 שבר-זהב ⇒ ישות אחרת מהסכמה (GENMAX·G5c): הזרע-הראשי של המודול ⇒ מפתחות+טיפוס-משוער ⇒ מיפוי לשדות-הישות (שם-זהה · ערוץ-מוצהר · טיפוס-יחיד · מקום-שמור — G5d) ⇒ שכתוב-ליטרלים+שמות-מחלקות+מונח-הישות ⇒ הרכבה compose · **G5e** `pickModule(E)`/`--entity E` (בורר-מודול לפי שמות+צורה, 49 ישויות · `retarget-picks.json`) · **G5g** `sourceTerms`/`swapTerms` (מונחי-המקור⇒מונחי-היעד בליטרלי-מחרוזת) · **G5h** עמודות-מקום-שמור לשדות-הישות ב-columnDefs · **G6c/d** מקטע-גרעין במסך ובפאנל-הרשומה (`<E>Core`, `_coreState`) · שער `retarget` (8 זוגות + טבלת-בחירה) |
| `generator/entity-terms.mjs` · `entity-terms.data.json` | 🔤 גשר-מונחי-ישות (GENMAX·G5f): חציבת `entity.*` מ-TERM_DEFS של maor (key · fallback · label) + נרדפות-ורטיקל מהמדף ⇒ ישות-סכמה (Volunteer/Family/…) — אטום-דאטה, לא מילון-במנוע · שער `entityterms` |
| `generator/sentence.mjs` · `sentence-golden.json` | 🗣️ משפט-בעברית ⇒ ישות ⇒ pickModule ⇒ retarget ⇒ מסך (GENMAX·G5f): התאמת-מילים לצורות-המונחים (זהה · אות-שימוש · ריבוי ־ים/־ות · הכלה) · אין-מונח ⇒ מקום-שמור · **G8d** `--subset`: שדות-המשפט ⇒ fieldOps ⇒ זריעה ממוקדת (`subsetFromSentence`) · שער `sentence` |
| `generator/app-from-sentences.mjs` · `app-golden.json` · `gen_app_*.dart` | 🏗️ משפטים ⇒ אפליקציה (GENMAX·G9): N משפטים ⇒ N מודולי-ישות (sentence⇒entity⇒pickModule⇒retarget) + רכזת-ניווט (DsScaffold+DsNavTile+Navigator.push) + בדיקת-ניווט מחוללת ל-buildsmart · שער `appgen` (push: determinism + flutter test) |
| `generator/enum-values.mjs` · `enum-values.data.json` | 🔢 ערכי-טיפוסים-מנויים (GENMAX·G6a): חציבת `export type X = 'a' \| 'b'` מ-domain.ts של maor (13 טיפוסים, סדר-הצהרה) — אטום-דאטה · שער `enumvalues` |
| `generator/core-from-shape.mjs` · `core-registry.json` · `core-registry-report.md` | 🧠 שכבת-הגרעין מהסכמה (GENMAX·G6a): לכל ישות — Registry (מונח·שדות·id) · Relations (`xId`⇒ישות: שם/סיומת+מרחב/תחילית-קצרה/מילה-אחרונה/self) · Workflow (status/stage/outcome ⇒ מצבים חצובים; מעברים מאטום-מדף או 'declared' מוצהר) · Events (IsoDate מחזור-חיים) · Rules (חובה/enum/ref/unique) · Notification (ערוצים) · policy=שקע-בעלים · שער `core` |
| `generator/core-dart.mjs` · `gen_core_*.dart` | 🧩 הגרעין כקוד (GENMAX·G6b): core-registry ⇒ מסך-Dart לכל ישות עם workflow — `_<E>Core` (מצבים · next() מאטום-מדף או declared · יחסים · חוקים · ערוצים · אירועים) + `<E>CoreScreen` מאטומי-DS בלבד · שער `coredart` |
| `generator/op-bridge.mjs` · `op-bridge.json` · `op-bridge-report.md` | 🌉 ניסוי-מדידה (GENMAX·G8a · **תוצאה שלילית**, L60): affinity[G2-op][G1-op] משכיחות-משותפת ב-9 מודולי-הזהב — לא מבחין (G2-ops כמעט-אוניברסליים ⇒ שורות זהות; הסכמה top-1 0/25). נשמר כמדידה, לא כשער |
| `generator/frag-ops.mjs` · `frag-ops.json` · `frag-ops-report.md` | 🔬 ייחוס-ops פר-שבר (GENMAX·G8b): מפתחות שהשבר קורא ⇒ טיפוס מרשימות-הזרע ⇒ `fieldOps` (G2) ⇒ G2-ops של השבר (557 שברים) · `fragmentsForEntity(E, module)` = זריעה לפי פעולות-היסוד (L49) · שער `fragops` |
| `compose-engine.mjs` | 🧩 קומפוזר-דטרמיניסטי (הכרעה 23-ג · §20-ד): חלקיק+נוסחה ⇒ פעולות-הצגה ⇒ אטום-אמיתי-הכי-טוב-לייעוד; טבלת-ATOM + FAKERS (מזייפים חסומים). שער `compose-determinism` חי (`--gate`, שלב 5). |
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
