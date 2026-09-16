# MEASURE-v2 — תיקון המדידה «מחובר-למחולל» · 16.9.2026

> **כל מספר כאן נושא את הפקודה שהוציאה אותו.** מספר בלי פקודה = טענה, לא עובדה.
> ענף `claude/fix-connected-260916` · בסיס `60ad1b72` · קומיט-הקוד `f09a9c4f`.
> שינוי-קוד: **קובץ אחד בלבד** — `machtzev/census/engine-index.mjs` (‏86+ / 22−).
> אפס `--write` · אפס commit ל-`machtzev/generator/engine-index.json` (‏`git status` נקי אחרי כל ריצה).

---

## 1 · לפני / אחרי — המספרים, עם הפקודה

### 1.1 הפקודה הראשית
```bash
node machtzev/census/engine-index.mjs --connected
```

| | לפני (‏`60ad1b72`) | אחרי (‏`f09a9c4f`) |
|---|---|---|
| מחוברים (הגדרה ישנה, כיוון אחד) | **57** | — (ההגדרה פוצלה) |
| מחוברים-**קדימה** (המחולל מגיע אליהם) | 57 | **59** |
| מחוברים-**אחורה** (קוראים למחולל) | לא נמדד | **10** |
| **בשניהם** | לא נמדד | **4** |
| **לא-מחוברים** | **285** | **277** |
| סה"כ בריפו | 342 | 342 |
| שערים | 57 | 57 |
| שערים מחוברים | 21 (חיתוך עם «מחובר») | 27 (קדימה **או** אחורה) |

פלט מילולי, לפני:
```
מחוברים-למחולל: 57 · לא-מחוברים: 285 · (מתוך 342 בריפו)
שערים: 57 · בשתי הקבוצות: 21 — קבוצות שונות, לא אותו דבר
```
אחרי:
```
מחוברים-קדימה (המחולל מגיע אליהם): 59 · מחוברים-אחורה (קוראים למחולל): 10 · בשניהם: 4 · לא-מחוברים: 277 · (מתוך 342 בריפו)
שערים: 57 · מהם מחוברים (קדימה או אחורה): 27 — קבוצות שונות, לא אותו דבר
```
בדיקת-עקביות: ‏59 + 10 − 4 = 65 מחוברים; ‏342 − 65 = **277** ✓.

⚠️ **הערת-היקף (‏`CLAUDE.md` · `HANDOFF`):** בקלון-טרי הסה"כ הוא 342 ולא 515 — 179
מנועים יושבים בריפואים-האחים שאינם כאן. הסה"כ לא זז בגלל השינוי הזה, וזה הנקודה.
‏(העובדים דיווחו 336 על `52dc8d56`. הפער **אינו הבדל-מדידה** — הרצתי את הקוד **הישן**
על `60ad1b72` (‏`git stash push machtzev/census/engine-index.mjs`) וקיבלתי **342** — אותו כלי,
ספירה אחרת ⇒ תוכן-הריפו השתנה בין שני ה-HEAD-ים. לא בדקתי אילו 6 קבצים — לא נדרש למשימה.)

### 1.2 קשתות-הייבוא (תרומת `await import`)
```bash
# scratchpad/arcs.mjs — סופר על הגרף בזיכרון, בלי --write · הרצה: node <קובץ>
import { build } from '/home/user/-ai-chat-server/machtzev/census/engine-index.mjs';
const { engines } = build();
let decl = 0, resolved = 0;
for (const e of engines) { decl += e.imports.length; resolved += e.importedBy.length; }
console.log(`${engines.length} · ${decl} · ${resolved}`);
```

| | לפני | אחרי | Δ |
|---|---|---|---|
| ייבואים-מוצהרים (‏`imports`) | 324 | **335** | **+11** |
| קשתות-מזוהות (‏`importedBy`, נתיב נפתר למנוע מאונדקס) | 291 | **302** | **+11** |
| קשתות-דינמיות שנפתרו | 0 | **12** | +12 |

**למה 12 קשתות אבל +11 מוצהרים:** ‏`sentence.mjs → ./render-module.mjs` מופיע **גם**
סטטית וגם דינמית, ו-`uniq` מאחד. מדוד:
```bash
# scratchpad/dup.mjs — לכל importsDyn בודק אם קיים גם `from '<אותו נתיב>'`
⇒ גם-סטטי וגם-דינמי: machtzev/generator/sentence.mjs → ./render-module.mjs   (שורה יחידה)
```

### 1.3 כל 12 הייבואים הדינמיים שנמצאו (`importsDyn`, על כלל הגרף)
```
--- כל הייבואים הדינמיים שנמצאו ---
  machtzev/dedup/dedup-atoms.mjs  →  ../generator/logic-proof.mjs
  machtzev/generator/app-ds.mjs  →  ./retarget.mjs
  machtzev/generator/app-ds.mjs  →  ./app-from-sentences.mjs
  machtzev/generator/app-ds.mjs  →  ./auto-skin.mjs
  machtzev/generator/frag-ops.mjs  →  ./render-module.mjs
  machtzev/generator/frag-ops.mjs  →  ./sentence.mjs
  machtzev/generator/render-module.mjs  →  ./shape-ops.mjs
  machtzev/generator/sentence.mjs  →  ./entity.mjs
  machtzev/generator/sentence.mjs  →  ./shape-ops.mjs
  machtzev/generator/sentence.mjs  →  ./render-module.mjs
  machtzev/generator/tzinor.mjs  →  ./intent.mjs
  machtzev/police.mjs  →  ./census/import-graph.mjs
```

### 1.4 אילו מנועים עברו קבוצה **בגלל הייבוא-הדינמי בלבד**
בידוד: אותו `connected()` בדיוק, על גרף שממנו הוסרו הקשתות שסומנו `importsDyn`
(‏`scratchpad/dyn-delta.mjs`; הבידוד אפשרי רק בזכות השדה החדש `importsDyn`):
```
קשתות-דינמיות שנפתרו למנוע מאונדקס: 12
בלי-דינמי:  forward 57 · reverse 9 · none 279
עם-דינמי:   forward 59 · reverse 10 · none 277
  ⇄ machtzev/generator/app-ds.mjs:    forward ⇒ both
  ⇄ machtzev/generator/intent.mjs:    none    ⇒ forward
  ⇄ machtzev/generator/shape-ops.mjs: none    ⇒ forward
```
שני המקרים שהעובדים הוכיחו — **שניהם אומתו כאן**:
- `shape-ops.mjs` — `render-module.mjs` ו-`sentence.mjs` מייבאים אותו דינמית; העובד
  הוכיח בריצה (`ops: ["channel","temporal","calendar","expiry","holidayGuard"]`).
  היה חיובי-שווא של «מנותק». עכשיו **forward**.
- `intent.mjs` — `tzinor.mjs:435` מייבא אותו דינמית. עכשיו **forward**.
  ‏🔴 **אבל** העובד מצא שהעוטפת `tzinor.purposeOf` אין לה אף קורא בריפו — כלומר
  ענף-מת בתוך קובץ חי. **המדידה תוקנה; הניתוק האמיתי נשאר.** `forward` אומר
  «יש שרשרת-ייבוא», לא «רץ בפועל». זו מגבלה מוצהרת של המדד, לא באג.
- `app-ds.mjs` (נקודת-כניסה) מייבא דינמית את `app-from-sentences.mjs` (נקודת-כניסה
  אחרת) ⇒ הוא עכשיו גם `reverse`. נכון לפי ההגדרה, ומדגים ש-`both` אינו חריג.

---

## 2 · הקבוצה החדשה `reverse` — מי קורא למחולל, ולאן

```bash
node machtzev/census/engine-index.mjs --connected --list-reverse
```
| מנוע | נקודת-הכניסה שאליה שרשרת-הייבוא מגיעה |
|---|---|
| `machtzev/generator/app-ds.mjs` | `machtzev/generator/app-from-sentences.mjs` |
| `machtzev/generator/balagan-one.mjs` | `machtzev/generator/balagan.mjs` |
| `machtzev/generator/ship.mjs` | `machtzev/generator/regen.mjs` |
| `machtzev/generator/skin-golden.mjs` | `machtzev/generator/app-from-sentences.mjs` |
| `machtzev/mahulal/generator-ratchet.mjs` | `machtzev/generator/app-ds.mjs` |
| `machtzev/mahulal/need-acceptance.mjs` | `machtzev/generator/app-ds.mjs` |
| `machtzev/mahulal/nl-quality.mjs` | `machtzev/generator/app-ds.mjs` |
| `machtzev/mahulal/nl-smoke.mjs` | `machtzev/generator/app-ds.mjs` |
| `machtzev/mahulal/spec-acceptance.mjs` | `machtzev/generator/app-ds.mjs` |
| `machtzev/one.mjs` | `machtzev/generator/regen.mjs` |

**7 מהעשרה היו «לא-מחוברים» לפני התיקון** (‏5 × `mahulal` · `balagan-one` — ו-`one.mjs`
שהיה ונשאר מחוץ ל-`forward`). `app-ds` · `ship` · `skin-golden` כבר היו `forward`.

🔴 **הממצא שהעובד מסר, ונאכף כאן במספר:** כל 5 מנועי-`mahulal` מייבאים `buildApp`
מ-`app-ds.mjs` — הם **שערי-הקבלה של המחולל**, 4 מהם רשומים ב-`gates.tsv` ורצים בכל
push. הם נספרו «לא-מחוברים» רק כי המדד הלך בכיוון אחד. חיבורם ל-`GEN_ENTRY` היה
יוצר מעגל; `reverse` הוא התשובה הנכונה — לא «לחבר», אלא **למדוד את הכיוון השני**.

**מה `reverse` בכוונה **אינו**:** לא רכיב-קשירות. הבדיקה היא BFS מנקודת-כניסה על
`importedBy` בלבד ⇒ כל צומת שנמצא הוא **אב** בגרף-הייבוא. לכן מי שמייבא את
`root.mjs` (שנקודות-הכניסה מייבאות) **אינו** נספר. אומת: `root.mjs` אינו ב-`reverse`,
ו-`reverse` מונה 10 ולא מאות.

---

## 3 · `one.mjs` — שני המספרים, וההכרעה נשארת לבעלים

`one.mjs` **לא** נוסף ל-`GEN_ENTRY`. נוסף דגל-מדידה:
```bash
node machtzev/census/engine-index.mjs --connected --with-entry machtzev/one.mjs
```
```
נקודת-כניסה נוספת (זמנית · לא ב-GEN_ENTRY): machtzev/one.mjs
  בייבוא-בלבד: קדימה 59 · אחורה 10 · לא-מחוברים 277  — ועם הרצה-בשם מאותו קובץ:
מחוברים-קדימה (המחולל מגיע אליהם): 92 · מחוברים-אחורה (קוראים למחולל): 10 · בשניהם: 4 · לא-מחוברים: 244 · (מתוך 342 בריפו)
שערים: 57 · מהם מחוברים (קדימה או אחורה): 31 — קבוצות שונות, לא אותו דבר
(‏--connected --list = הלא-מחוברים · --list-reverse = הקוראים-למחולל + נקודת-הכניסה · --with-entry <קובץ> = מדידה עם נקודת-כניסה נוספת)
```

### 3.1 למה **שני** מספרים ולא אחד
| קריאה | קדימה | לא-מחוברים | מה היא מודדת |
|---|---|---|---|
| בלי `one.mjs` (המצב הרשמי) | 59 | 277 | 6 נקודות-הכניסה של `GEN_ENTRY` |
| `--with-entry one.mjs`, **בייבוא-בלבד** | **59** | **277** | ללא שינוי |
| `--with-entry one.mjs`, **+ הרצה-בשם** | **92** | **244** | +33 מנועים |

**ההפרש הוא הממצא, לא תקלה.** ‏`one.mjs` **אינו מייבא** את המנועים שהוא מריץ —
הוא מריץ אותם בתת-תהליך:
```bash
grep -n "^import\|const run =" machtzev/one.mjs
  7: import { execFileSync, execSync } from 'node:child_process';
 10: import { REGEN, INDEX, label } from './generator/regen.mjs';     # הייבוא **היחיד** למנוע-אחר
 31: const run = (script, args = []) => execFileSync('node', [path.join(ROOT, script), ...args], …);
```
לכן נקודת-כניסה בייבוא-בלבד היא מדידה **אמיתית וריקה** (‏59⇒59): `one.mjs` כבר
`reverse` דרך `regen.mjs`, ואין לו מה להוסיף בכיוון-הייבוא. המספר המעניין מתקבל
רק כשמחילים על `one.mjs` את **אותו כלל הרצה-בשם** ש-`connected()` כבר מחיל על
`regen.mjs`/`ship.mjs` — וזה מה שהדגל עושה (`runByNameExtra`). שווה-מול-שווה.

### 3.2 33 המנועים ש-`one.mjs` מוסיף (‏`scratchpad/one-delta.mjs`)
```
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/board-gen.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/box-audit.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/data-lift.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/gen-manifest.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/gen-screen.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/assemble/shelf-lift.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/audit/run.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/carve/screen-decomp.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/carve/screen-lift.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/carve/widget-dedup.mjs
  ↳ טרנזיטיבי (מיובא ע"י מנוע שרץ)  machtzev/census/import-graph.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/chisel-all.mjs
  ↳ טרנזיטיבי (מיובא ע"י מנוע שרץ)  machtzev/dart-bin.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/dedup/dedup-atoms.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/dedup/dedup-cross-dart.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/deep-purity-scan.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/ds-critic.mjs
  ↳ טרנזיטיבי (מיובא ע"י מנוע שרץ)  machtzev/generator/dart-twins.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/generator/synth.mjs
  ↳ טרנזיטיבי (מיובא ע"י מנוע שרץ)  machtzev/lib-ts.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/police.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/pure/pure-decompose.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/pure/pure-lint.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/purify-dart.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/purity/purify-engine.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/purity/purify-hard.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/purity/purity-data.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/purity/reconvert-data.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/run.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/tools/box-coverage.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/tools/gen-wiring-doc.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/verify-dart-arg0.mjs
  ▶ נתיב-מצוטט ב-one.mjs  machtzev/verify-dart-tests.mjs
```

29 מתוך 33 מופיעים ב-`one.mjs` כ**נתיב-מצוטט** (בדוק ברגקס מול המקור); 4 הנותרים
(`census/import-graph` · `dart-bin` · `dart-twins` · `lib-ts`) נכנסו **טרנזיטיבית**
דרך מנוע שכן רץ — ‏`import-graph` מיובא דינמית מ-`police.mjs`, ו-`dart-bin` מ-`synth.mjs:15`
(בדיוק שני המקרים שהעובד סימן כ«סווגו לא-מחובר בטעות-מדידה»).

⚠️ **מגבלה מוצהרת של המספר 92:** כלל «הרצה-בשם» הוא `pipe.includes(<נתיב>)` —
**הכלה-בטקסט**, לא ניתוח. זה הכלל הקיים מאז ומעולם (‏`connected()` על `regen`/`ship`),
והחלתי אותו על `one.mjs` ללא שינוי כדי שההשוואה תהיה הוגנת. הוא מאותה משפחת-פגמים
כמו `calledByName` (§5). 92 הוא **תקרה**, לא ספירה מדויקת.

🔴 **ההכרעה שנשארת לבעלים:** האם `one.mjs` הוא נקודת-כניסה של המחולל.
אם כן — 33 מנועים (‏`assemble/` · `carve/` · `purity/` · `pure/` · `dedup/` · `tools/`)
עוברים מ«לא-מחובר» ל«מחובר» בלי שורת-קוד אחת של חיווט; הם **כבר רצים** בכל `one.mjs`.
אם לא — הם נשארים ב-`none`, ואז `none` מודד «לא בצינור-GENMAX» ולא «לא רץ».
לא הכרעתי. הדגל נותן את המספר, לא את התשובה.

---

## 4 · רשימת ה-`none` החדשה — 277, שורה לשורה

```bash
node machtzev/census/engine-index.mjs --connected --list
```

**8 מנועים יצאו מהרשימה** לעומת הבסיס (285 ⇒ 277). ‏`diff` מלא של השתיים:
```diff
<   ○ machtzev/generator/balagan-one.mjs          ⇒ reverse (balagan.mjs)
<   ○ machtzev/generator/intent.mjs               ⇒ forward (ייבוא דינמי מ-tzinor.mjs:435)
<   ○ machtzev/generator/shape-ops.mjs            ⇒ forward (ייבוא דינמי מ-render-module/sentence)
<   ○ machtzev/mahulal/generator-ratchet.mjs      ⇒ reverse (app-ds.mjs)
<   ○ machtzev/mahulal/need-acceptance.mjs        ⇒ reverse (app-ds.mjs)
<   ○ machtzev/mahulal/nl-quality.mjs             ⇒ reverse (app-ds.mjs)
<   ○ machtzev/mahulal/nl-smoke.mjs               ⇒ reverse (app-ds.mjs)
<   ○ machtzev/mahulal/spec-acceptance.mjs        ⇒ reverse (app-ds.mjs)
```
**אף מנוע לא נכנס** לרשימה. הכיוון חד-כיווני כמצופה: תיקון-מדידה רק מגלה חיבור, לא מסתיר.

הרשימה המלאה (277):
```
  ○ .claude/hooks/pre-tool.sh
  ○ .claude/hooks/session-start.sh
  ○ .githooks/commit-msg
  ○ .githooks/post-commit
  ○ .githooks/post-rewrite
  ○ .githooks/pre-applypatch
  ○ .githooks/pre-commit
  ○ .githooks/pre-merge-commit
  ○ .githooks/pre-push
  ○ .github/workflows/gen.yml
  ○ .github/workflows/police.yml
  ○ box-drafts/buildsmart-seed/is-barcode-supported@app_src_lib_barcode_ts.mjs
  ○ box-drafts/buildsmart-seed/is-voice-supported@app_src_lib_voice_ts.mjs
  ○ box-drafts/buildsmart-seed/search-exact@app_src_lib_search_ts.mjs
  ○ box-drafts/buildsmart-seed/search-fuzzy@app_src_lib_search_ts.mjs
  ○ box-drafts/buildsmart-seed/start-barcode-scanner@app_src_lib_barcode_ts.mjs
  ○ box-drafts/buildsmart-seed/start-voice-recognition@app_src_lib_voice_ts.mjs
  ○ box-drafts/io-wiring/audit-writer-email@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/donation-split-active@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/fetch-outbox-issues@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/hebrew-closed-windows@src_lib_telephony_engine_ts.mjs
  ○ box-drafts/io-wiring/mark-incoming-payment@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/pull-all@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/retry-outbox-item@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/score-term@src_lib_search_ts.mjs
  ○ box-drafts/io-wiring/simulate-call@src_lib_telephony_engine_ts.mjs
  ○ box-drafts/io-wiring/subscribe-all@src_lib_cloud_ts.mjs
  ○ box-drafts/io-wiring/validate-tenant@src_lib_telephony_engine_ts.mjs
  ○ box-drafts/io-wiring/watch-all-support-threads@src_lib_cloudConfig_ts.mjs
  ○ box-drafts/io-wiring/watch-auth@src_lib_cloud_ts.mjs
  ○ engine/atlas.mjs
  ○ engine/generate.mjs
  ○ engine/lib.mjs
  ○ gen/build.mjs
  ○ gen/detach.mjs
  ○ gen/engine.mjs
  ○ gen/flutter.mjs
  ○ gen/fonts.mjs
  ○ gen/index-page.mjs
  ○ gen/inventory.mjs
  ○ gen/lang.mjs
  ○ gen/lenses.mjs
  ○ gen/live.mjs
  ○ gen/looks/agora/build.mjs
  ○ gen/looks/app/audit.mjs
  ○ gen/looks/app/build.mjs
  ○ gen/looks/build-index.mjs
  ○ gen/looks/buybox/build.mjs
  ○ gen/looks/diyun/build.mjs
  ○ gen/looks/erech/build.mjs
  ○ gen/looks/first10/audit.mjs
  ○ gen/looks/first10/build.mjs
  ○ gen/looks/first10/designs/combos.mjs
  ○ gen/looks/first10/designs/kits.mjs
  ○ gen/looks/full5/art.mjs
  ○ gen/looks/full5/audit.mjs
  ○ gen/looks/full5/build.mjs
  ○ gen/looks/full5/screens/1-raycast.mjs
  ○ gen/looks/full5/screens/2-spotify.mjs
  ○ gen/looks/full5/screens/3-duolingo.mjs
  ○ gen/looks/full5/screens/4-wise.mjs
  ○ gen/looks/full5/screens/5-monzo.mjs
  ○ gen/looks/grafa/build.mjs
  ○ gen/looks/hechzer/build.mjs
  ○ gen/looks/measure/extract.mjs
  ○ gen/looks/measure/match.mjs
  ○ gen/looks/measure/probe.mjs
  ○ gen/looks/measure/sheet.mjs
  ○ gen/looks/measure/tokens.mjs
  ○ gen/looks/medrash/probe.mjs
  ○ gen/looks/nochah/build.mjs
  ○ gen/looks/people/best.mjs
  ○ gen/looks/people/bestsheet.mjs
  ○ gen/looks/people/btn.mjs
  ○ gen/looks/people/btn2.mjs
  ○ gen/looks/people/btnlab.mjs
  ○ gen/looks/people/cmpsheet.mjs
  ○ gen/looks/people/compare.mjs
  ○ gen/looks/people/compare2.mjs
  ○ gen/looks/people/compare3.mjs
  ○ gen/looks/people/demo.mjs
  ○ gen/looks/people/design.mjs
  ○ gen/looks/people/grab.mjs
  ○ gen/looks/people/grab2.mjs
  ○ gen/looks/people/grab3.mjs
  ○ gen/looks/people/lab.mjs
  ○ gen/looks/people/mdm.mjs
  ○ gen/looks/people/merged.mjs
  ○ gen/looks/people/money.mjs
  ○ gen/looks/people/person.mjs
  ○ gen/looks/people/sheet.mjs
  ○ gen/looks/people/toast.mjs
  ○ gen/looks/people/undo.mjs
  ○ gen/looks/search/build.mjs
  ○ gen/looks/sefer/build.mjs
  ○ gen/looks/sulam/build.mjs
  ○ gen/looks/tavla/build.mjs
  ○ gen/looks/tor/build.mjs
  ○ gen/looks/trumot/probe.mjs
  ○ gen/looks/tzevet/build.mjs
  ○ gen/looks/tzevet/probe.mjs
  ○ gen/looks/vaada/build.mjs
  ○ gen/mosad-build.mjs
  ○ gen/packs-apply.mjs
  ○ gen/pass.mjs
  ○ gen/plan.mjs
  ○ gen/prove-dart.mjs
  ○ gen/prove.mjs
  ○ gen/render.mjs
  ○ gen/sentence.mjs
  ○ gen/shelf.mjs
  ○ gen/site.mjs
  ○ gen/skin.mjs
  ○ gen/spec.mjs
  ○ gen/studio.mjs
  ○ gen/wizard.mjs
  ○ knowledge/assets/yeshiva-bench/audit_block.py
  ○ knowledge/assets/yeshiva-bench/rules3.py
  ○ knowledge/assets/yeshiva-bench/rules4.py
  ○ knowledge/assets/yeshiva-bench/rules5.py
  ○ knowledge/assets/yeshiva-bench/score_h3.sh
  ○ knowledge/assets/yeshiva-bench/wait_h.sh
  ○ machtzev/allow-check.mjs
  ○ machtzev/assemble/board-gen.mjs
  ○ machtzev/assemble/box-audit.mjs
  ○ machtzev/assemble/data-lift.mjs
  ○ machtzev/assemble/gen-manifest.mjs
  ○ machtzev/assemble/gen-screen.mjs
  ○ machtzev/assemble/gen-theme.mjs
  ○ machtzev/assemble/shelf-lift.mjs
  ○ machtzev/assemble/tokens-roundtrip.mjs
  ○ machtzev/atom-count-check.mjs
  ○ machtzev/audit-gates.mjs
  ○ machtzev/audit/diff.mjs
  ○ machtzev/audit/features.mjs
  ○ machtzev/audit/gen-forge-dart.mjs
  ○ machtzev/audit/gen-orig.mjs
  ○ machtzev/audit/heal.mjs
  ○ machtzev/audit/lib.mjs
  ○ machtzev/audit/run.mjs
  ○ machtzev/behavioral/gen_store_behavior_test.dart
  ○ machtzev/behavioral/gen_widget_behavior_test.dart
  ○ machtzev/behavioral/run.mjs
  ○ machtzev/box-assemble.mjs
  ○ machtzev/box-data-lift.mjs
  ○ machtzev/box-magic-lift.mjs
  ○ machtzev/box-proofs-check.mjs
  ○ machtzev/box-purify.mjs
  ○ machtzev/carve/ast_carve.dart
  ○ machtzev/carve/ast_dehardcode_interp.dart
  ○ machtzev/carve/ast_dehardcode.dart
  ○ machtzev/carve/carve-land.mjs
  ○ machtzev/carve/screen-decomp.mjs
  ○ machtzev/carve/screen-lift.mjs
  ○ machtzev/carve/widget-dedup.mjs
  ○ machtzev/census/engine-index.mjs
  ○ machtzev/census/import-graph.mjs
  ○ machtzev/chisel-all.mjs
  ○ machtzev/chisel.mjs
  ○ machtzev/contract-check.mjs
  ○ machtzev/coverage-gate.mjs
  ○ machtzev/cross-source-check.mjs
  ○ machtzev/dart-bin.mjs
  ○ machtzev/data-purity-check.mjs
  ○ machtzev/dedup/dedup-atoms.mjs
  ○ machtzev/dedup/dedup-cross-dart.mjs
  ○ machtzev/dedup/dedup-cross.mjs
  ○ machtzev/dedup/dedup-deep.mjs
  ○ machtzev/dedup/dedup.mjs
  ○ machtzev/dedup/reconcile.mjs
  ○ machtzev/deep-purity-scan.mjs
  ○ machtzev/ds-critic.mjs
  ○ machtzev/ds-graphics.mjs
  ○ machtzev/ds-motion.mjs
  ○ machtzev/ds-pure.mjs
  ○ machtzev/ds-tokens.mjs
  ○ machtzev/ds-variants.mjs
  ○ machtzev/emit/ast-js-to-dart.mjs
  ○ machtzev/emit/dart-to-js.mjs
  ○ machtzev/emit/free-ref-scan.mjs
  ○ machtzev/emit/fuzz-parity.mjs
  ○ machtzev/emit/js-to-dart.mjs
  ○ machtzev/emit/parity-ast.mjs
  ○ machtzev/emit/parity-check.mjs
  ○ machtzev/emit/parity-js-dart.mjs
  ○ machtzev/empire-coverage.mjs
  ○ machtzev/extract/actions.mjs
  ○ machtzev/extract/components.mjs
  ○ machtzev/extract/consts.mjs
  ○ machtzev/extract/engines.mjs
  ○ machtzev/extract/flags.mjs
  ○ machtzev/extract/functions.mjs
  ○ machtzev/extract/icons.mjs
  ○ machtzev/extract/knowledge.mjs
  ○ machtzev/extract/regexes.mjs
  ○ machtzev/extract/schema.mjs
  ○ machtzev/extract/strings.mjs
  ○ machtzev/extract/styles.mjs
  ○ machtzev/extract/terms.mjs
  ○ machtzev/extract/tokens.mjs
  ○ machtzev/extract/verticals.mjs
  ○ machtzev/generator/balagan-look.mjs
  ○ machtzev/generator/balagan-run.mjs
  ○ machtzev/generator/capability.mjs
  ○ machtzev/generator/combine-screens.mjs
  ○ machtzev/generator/dart-twins.mjs
  ○ machtzev/generator/entity-terms.mjs
  ○ machtzev/generator/enum-values.mjs
  ○ machtzev/generator/frag-ops.mjs
  ○ machtzev/generator/generate.mjs
  ○ machtzev/generator/golden-harness.mjs
  ○ machtzev/generator/hamtzaa.mjs
  ○ machtzev/generator/legacy/app.mjs
  ○ machtzev/generator/legacy/compose.mjs
  ○ machtzev/generator/legacy/entities.mjs
  ○ machtzev/generator/legacy/nl.mjs
  ○ machtzev/generator/legacy/teach.mjs
  ○ machtzev/generator/op-bridge.mjs
  ○ machtzev/generator/retrieve-screen.mjs
  ○ machtzev/generator/server-gate.mjs
  ○ machtzev/generator/studio-full.mjs
  ○ machtzev/generator/synth.mjs
  ○ machtzev/generator/tighten-loader.mjs
  ○ machtzev/goal-card.mjs
  ○ machtzev/goal-proof-check.mjs
  ○ machtzev/index-check.mjs
  ○ machtzev/learn-check.mjs
  ○ machtzev/learn-draft.mjs
  ○ machtzev/lib-ts.mjs
  ○ machtzev/merge-regen.mjs
  ○ machtzev/mutation-check.mjs
  ○ machtzev/mutation-dart-check.mjs
  ○ machtzev/no-fakers-check.mjs
  ○ machtzev/police-selftest.mjs
  ○ machtzev/police.mjs
  ○ machtzev/pretool-selftest.mjs
  ○ machtzev/pure/pure-decompose.mjs
  ○ machtzev/pure/pure-e2e-proof.gen.mjs
  ○ machtzev/pure/pure-forge.mjs
  ○ machtzev/pure/pure-lint.mjs
  ○ machtzev/pure/pure-look-proof.gen.mjs
  ○ machtzev/pure/shot.mjs
  ○ machtzev/purify-dart-native.mjs
  ○ machtzev/purify-dart.mjs
  ○ machtzev/purity/ast-purify-interp.mjs
  ○ machtzev/purity/ast-purify.mjs
  ○ machtzev/purity/const-normalize.mjs
  ○ machtzev/purity/dehardcode.mjs
  ○ machtzev/purity/gen-data-dart.mjs
  ○ machtzev/purity/independence-check.mjs
  ○ machtzev/purity/purify-engine.mjs
  ○ machtzev/purity/purify-hard.mjs
  ○ machtzev/purity/purify.mjs
  ○ machtzev/purity/purity-data.mjs
  ○ machtzev/purity/reconvert-data.mjs
  ○ machtzev/quarry-check.mjs
  ○ machtzev/ratchet-direction.mjs
  ○ machtzev/repair-quarantine.mjs
  ○ machtzev/rethread-boxes.mjs
  ○ machtzev/run.mjs
  ○ machtzev/search-proof-check.mjs
  ○ machtzev/search-record.mjs
  ○ machtzev/search-score.mjs
  ○ machtzev/tools/box-coverage.mjs
  ○ machtzev/tools/dart-test.mjs
  ○ machtzev/tools/gen-wiring-doc.mjs
  ○ machtzev/tools/promote-auto.mjs
  ○ machtzev/tools/refine.mjs
  ○ machtzev/verify-dart-arg0.mjs
  ○ machtzev/verify-dart-tests.mjs
  ○ machtzev/verify-independent.mjs
  ○ machtzev/wave-partition.mjs
  ○ machtzev/wiring-check.mjs
  ○ server-gen/balagan/functions/index.js
  ○ server-gen/balagan/rules.test.mjs
  ○ yeshiva/detach.mjs
  ○ yeshiva/gate.mjs
```

---

## 5 · משטרה — לפני / אחרי

```bash
node machtzev/police.mjs --fast
```
| | שורת-הסיום |
|---|---|
| **לפני** (‏`60ad1b72`) | `✅ המשטרה ירוקה — 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57` |
| **אחרי** (‏`f09a9c4f`) | `✅ המשטרה ירוקה — 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57` |

**אף שער לא החליף צבע.** זהות מלאה בארבעת המונים.

### 5.1 האם שער כלשהו תלוי בפלט `engine-index`? — **לא.** נמדד:
```bash
grep -rn "engine-index" --exclude-dir=node_modules --exclude-dir=.git -l .
  ./CLAUDE.md                              # פרוזה
  ./knowledge/HANDOFF-2026-09-16.md        # פרוזה
  ./machtzev/INDEX.md                      # פרוזה
  ./machtzev/census/engine-purposes.data.json
  ./machtzev/census/engine-index.mjs        # הקובץ עצמו
  ./machtzev/generator/engine-index.json    # הפלט (לא נגעתי)
```
אפס `.mjs`/`.tsv`/`.sh`/`.yml` מריץ או מייבא אותו ⇒ `index-complete` ושאר 56 השערים
אינם רואים את השינוי. וכן:
```bash
grep -n "engine-index" machtzev/pins.sha256   ⇒ (אין פלט) — הקובץ אינו נעול-חתימה
```
לכן `pins-check` לא הושפע, ולא נדרש `--write` לשוטר.

### 5.2 שאר מצבי-ה-CLI — לא נשברו
```bash
node machtzev/census/engine-index.mjs --find "מטרה"   ⇒ 5 תוצאות מדורגות (3.05 data-lift …)
node machtzev/census/engine-index.mjs app-ds.mjs       ⇒ כרטיס מלא (369 שורות · buildApp · 5 מייבאים)
node machtzev/census/engine-index.mjs --orphans        ⇒ בלי-מטרה: 24 · בלי-קורא: 75
node machtzev/census/engine-index.mjs                  ⇒ 342 מנועים · 318 עם מטרה (93%) · 75 בלי קורא
```
‏«בלי קורא ידוע: **75**» — **זהה לבסיס** (נמדד ע"י `git stash` על הקובץ, ריצה, `stash pop`).
הקשתות-הדינמיות החדשות לא שינו אותו כי אותם מנועים כבר נשאו `calledByName`.

---

## 6 · מה **לא** תוקן — במכוון, ומוצהר

### 6.1 `calledByName` / התאמת-שם (‏סעיף ד של המשימה — מחוץ להיקף)
לא נגעתי. הפגם מתועד בקובץ עצמו (‏ההערה ב-`engine-index.mjs`, «`run.mjs` ⇄
`balagan-run.mjs` ⇒ 16 מנועים תבעו שער שאינו שלהם») ובראיית העובד:
`pure/shot.mjs` מדווח «נקרא-בשם: ship», בעוד `ship.mjs:98` קורא ל-`tools/site-shot.mjs`
— קובץ אחר. **מסקנה:** עמודת `נקרא-בשם` בכרטיס עדיין אינה ראיה, ו-`forward` יורש
את החולשה דרך כלל הרצה-בשם (§3.2). זהו הפגם הרביעי, והוא **נשאר פתוח**.

### 6.2 `forward` ≠ «רץ»
`intent.mjs` עבר ל-`forward` כי יש שרשרת-ייבוא — אבל העוטפת שלו (`tzinor.purposeOf`)
אין לה קורא. המדד אומר «נגיש», לא «מורץ». מי שיקרא 59 כ«59 מנועים פועלים» — טועה.

### 6.3 ריפואים-אחים
`--connected` מסנן `yeshiva-engine/` ו-`buildsmart/` כמקודם (179 מנועים). לא שיניתי.

---

## 7 · סיכום בשורה אחת

```
לפני:  57 מחוברים · 285 לא-מחוברים                                     (כיוון אחד · עיוור ל-await import)
אחרי:  59 קדימה · 10 אחורה · 4 בשניהם · 277 לא-מחוברים                  (שני כיוונים · רואה ייבוא דינמי)
       92 קדימה · 244 לא-מחוברים  ← אם one.mjs היא נקודת-כניסה (הכרעת-בעלים)
```
