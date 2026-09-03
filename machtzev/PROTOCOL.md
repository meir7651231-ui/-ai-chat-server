# 🛡️ PROTOCOL v4 — פרוטוקול-המחצב, אחרי שני סבבי red-team

> **מה זה:** תוכנית-האכיפה-והייעול של המחצב. החוקים כבר קיימים; הפרוטוקול הופך אותם למכניקה.
> **v4:** v3 עבר סבב-שבירה שני (5 עדשות, 63 ממצאים, `RED-TEAM-PROTOCOL.md` §סבב-2), הפעם על המנגנונים שהוספתי כתשובה לסבב 1. שלושה מהם נפלו: **המאמת-העצמאי** (מדד את ה-tag מול עצמו), **ALLOW-tracked** (deadlock + צ׳ק פתוח), ו-**M5** (הרצת קוד-שרירותי בתוך שכבת-האכיפה). ושתי עובדות-סביבה שהנחתי הפוך: Dart **קיים** במכונה זו (3.7.2), ו-`contract` לבדו לוקח **60 שניות**.
> **העקרונות:** ייצור לפני בדיקה (רק מבייטים חד-משמעיים) · אינקרמנטלי לפני מלא (fail-closed) · מס-פרוטוקול נמדד · שום דבר על-המארח אינו חומה — ולפי הכרעה F, גם לא מבחוץ. **יש עד, אין חומה.**
> **מצב:** לאישור-בעלים (3.9.2026) · ענף `claude/hei-rxv1v1` · שלב 0 מוגדר-מחדש כ-bootstrap של 5 commits (§12).

---

## תוכן
| § | נושא |
|---|---|
| 0 | העקרונות · כלל-המיון · מה הפרוטוקול טוען ומה לא |
| 1 | מצב-הפתיחה (נמדד, מתוקן) |
| 2 | המדדים — `wired/eligible`, מס-פרוטוקול |
| 3 | הטבעות — commit · push · CI-עד; אירועי-git שאינם מריצים hooks |
| 4 | מנועי-hook (5) · צהוב · ledger · sandbox לבדיקות |
| 5 | העד: ראצ׳ט-כיוון + מאמת-עצמאי שבאמת מודד |
| 6 | `pre-tool.sh` — מה הוא באמת (tripwire), deny של MCP |
| 7 | השערים — commit · push · CI, כולל 6 חסרים |
| 8 | למידה v4 — לקח שמוכיח את עצמו מול ההיסטוריה |
| 9 | timeouts · lock · מס · גיזום |
| 10 | כרטיס-המצב |
| 11 | הכרעות-בעלים (A–N) |
| 12 | Bootstrap: שלב 0 = 5 commits, ואז שלבים 1–8 |
| 13 | D3 |
| א׳ | מה נמחק/שונה מ-v3 |

---

## §0 · העקרונות, כלל-המיון, ומה הפרוטוקול טוען

1. **ייצור לפני בדיקה — רק מבייטים חד-משמעיים.** מנוע-hook מייצר רק מה שיש לו מקור-אמת יחיד (index → TRUTH; imports → WIRING; docline → INDEX). שיפוט (regex, חוזה, fixture, DoD) — הסוכן כותב, השער מאמת מול **ההיסטוריה** (blob), לא מול פרוזה.
2. **אינקרמנטלי לפני מלא — fail-closed.** אין גרף / קובץ בלי בעלים / import דינמי / > 50 קבצים ⇒ מלא, מוצהר.
3. **מס-פרוטוקול נמדד** משעון git; רק CI סופר.
4. **מספר לא יכול לשקר.** ספירות רק מ-`gates.tsv`. אין סכומים ידניים.
5. **שער לא כותב.** אף שער לא משנה baseline/tree בזמן ריצה (היום 4 עושים זאת). כיווץ-baseline מדווח ומוחל בטבעת-push בלבד.
6. **תוכן זר לא רץ עם הסביבה שלי.** כל `*.test.mjs` רץ ב-sandbox (env מסונן, cwd זמני, timeout, SIGKILL). היום 1,239 בדיקות רצות עם הטוקנים של הסשן.

**כלל-המיון:**
```
ניתן לייצר מבייטים חד-משמעיים?      ⇒ מנוע-hook (§4)
< 5s על diff+צרכנים?                ⇒ commit (§7.1)
עץ-שלם / דקות?                      ⇒ push (§7.2)
סביבה נקייה / השוואה ל-tag?         ⇒ CI-עד (§7.3) + מאמת-עצמאי (§5)
מספר?                               ⇒ מדד (§2)
```

**מה הפרוטוקול טוען (D3 על עצמו):**
| שכבה | מה היא | מה היא לא |
|---|---|---|
| hooks · מנועים · שערים | רצפה מול טעות-כנה ומיס-נרציה; מונעים את רוב הבאגים לפני commit | לא מונעים מסוכן שרוצה לעקוף |
| `pre-tool.sh` | **tripwire** על ההרגלים של המודל (`-n`, `--force`, `rm hook`) | לא מסנן-פקודות; `bash script.sh`, `node -e`, `curl`+token עוברים |
| ALLOW / trailers | שובל-ביקורת ב-`git log` | לא אישור-בעלים |
| CI על push | **עד** — רץ, מדווח, לא חוסם (F) | לא קיר |
| מאמת-עצמאי | עד שני, עם כלים מ-tag ידוע-טוב, שמודד באמת (§5) | לא חוסם; מקדם tag רק עם ack |

---

## §1 · מצב-הפתיחה (3.9.2026 · HEAD `e29f96e` · נמדד)

| מדד | ערך |
|---|---|
| שערים `gates.tsv` = `police.mjs` | 21 (`CLAUDE.md`: 19) |
| הוכחת-ירי בזוג | 3/21; `run()` הופך כל non-zero ל-1 (קריסה = "יורה") |
| `police --fast` כאן | 🚨 EXIT=1 — `freeref`·`deeppurity` קורסים (`typescript` מ-`/home/user/maor-system/`); 5 מדולגים נספרים `ran` |
| **Dart** | **קיים:** `/home/user/flutter/bin/dart` 3.7.2 (לא 3.13.2 של session-start). `boxes` רץ: 62 הוכחות, 31s. `synth` משתמש ב-resolver אחר ומדלג בשקט על חצי-Dart (exit 0) |
| זמני-שערים | `contract` **59.6s** (1,239 בדיקות) · `truth` 9.3s · `boxes` 30.7s · `mutation` ≥ 2 דק׳ · השאר < 1s |
| אורקלים לתצוגה | `atom-index.json` 554 · `atom-census.json` **522, ישן, תת-קבוצה טהורה של האינדקס בלי אף צרכן לשדותיו-הייחודיים** · שני הסורקים חיים = 554 · אף אחד לא מחדש אוטומטית |
| **שמות-מחלקה כפולים** ב-`dart-ui-bs` | **8** (StatusDot · StatusChip · ProgressRing · NeonButton · GlassCard · EmptyState · DonutChart · AlertBanner) — קונסטרקטורים שונים; הראשון-אלפביתית מנצח בשקט; שני הסורקים ממיינים אחרת |
| `wired` | 53/1332 לפי זוכי-תיקו; **תקרה מבנית:** 543/1364 (39.8%) — 821 אטומים לא ניתנים-לחיווט תחת שום הגדרה |
| שערים שכותבים baseline בריצה | 4: `coverage-gate:54` · `box-proofs:53` · `data-purity:52` · `deep-purity:103` |
| `gen_app_*.dart` | 49 tracked; 13 סקריפטים כותבים/קוראים נתיב קשיח; `board-gen:523` פולט `import '../dart-gen-bs/…'` לתוך Dart מחולל |
| hooks בגיט | **לא רצים** ב-rebase (picks/`--continue`) · `cherry-pick` · `git am` — אומת git 2.43 |
| נעולים | 11, 16-hex; **לא:** `truth.mjs` · `render-ds` · `census/*` · `coverage-gate` · 14/21 סקריפטי-שער · baselines · `LEARNINGS.md` |
| git hooks · pre-tool · CI · tag | אין · אין · אין · אין (`git tag -l` = 0, גם ב-origin) |
| Settings בסשן זה | חלות הגדרות **הפרויקט** (buildsmart); `pre-tool.sh` של buildsmart חוסם כאן, כולל **קריאה** של hooksPath |
| סביבה | shallow · `CLAUDE_PROJECT_DIR` ריק בתת-סוכנים · Linux |

---

## §2 · המדדים

### §2.1 `wired / eligible` (הכרעות I + N)
- **eligible** (מחושב ב-`truth.mjs`): תצוגה `fields∧str≥1 ∪ collection ∪ series` + לוגיקה `wireable`. היום **543/1364**. 100% נמדד מול זה, לא מול 1364.
- **wired** (הכרעה I): אטומים ש-`renderCompose`/`selectVaried` **פלטו בפועל** על **קורפוס נעול** (`generator/acceptance-space.txt`, hash ב-pins; עריכת-קורפוס = אירוע-ראצ׳ט עם trailer `Allow: corpus`). לא כולל 21 שמות-תבנית קשיחים (DsTable, DsScaffold…). מדווח **לצד** מספר-הנגישות הישן (זוכי-תיקו), לא במקומו.
- שורת-commit: `🔌 wired 53 → 61 / eligible 543 (11.2%)`.
- **הרצפה** (`wired-floor.json`): `truth.mjs --write --no-floor` תמיד ב-hook. הרצפה זזה **רק** ב-CI-עד כ-commit-בוט `🔌 floor N→M` אחרי `oracle`+`coverage`+`truth` ירוקים. **ירידת-רצפה** = החלשה מוצהרת: trailer `Allow: floor:<n> L-…` + שורה ב-§5 (אין un-ratchet שקט; `truth --gate` ב-commit משווה ל-merge-base, לא ל-HEAD).

### §2.2 מס-פרוטוקול
`⏱ protocol 41s (contract-inc 12s · truth 9s · gates 3s · gen 2s)` משעון git. תקרות (`gates.tsv` שורת `protocol-tax`): commit **60s** כולל מנועים · id בודד **20s** · push **10 דק׳**. חריגה = 🚨 על הפרוטוקול, הקוד ממשיך. רק CI-stats מזינים גיזום.

---

## §3 · הטבעות

| טבעת | מתי | תקציב | מה רץ | חוסם |
|---|---|---|---|---|
| **commit** | `pre-commit` · `pre-merge-commit` (=pre-commit, כותב ledger) · **`pre-applypatch`** (=pre-commit) · `post-commit` (מוסיף ל-index את הנתיבים המחוללים — סוגר את ה-churn של `commit <paths>`) · `post-rewrite` (**לא amend** — מסמן `.git/REGEN_NEEDED`) | 60s | מנועים → §7.1 → `police --inc` | אדום כן · צהוב לא (מוצהר, בתנאי §4.2) |
| **push** | `pre-push` על **`git worktree add --detach $TMP $sha`** (לא archive: כולל `export-ignore`, `NODE_PATH` ל-node_modules) · סקופ לפי `remote_ref` · **freshness לכל commit ב-`merge-base..sha`** (סוגר rebase/cherry-pick) · ratchets מול merge-base | 10 דק׳ | `police` מלא · §7.2 | אדום כן · צהוב כן (אלא trailer `Allow: yellow-push`) |
| **CI-עד** | push + PR · `fetch-depth: 0` · **non-required** (F) | — | הכל בסביבה נקייה + G0 ראצ׳ט-כיוון מול tag (§5) | **לא חוסם — מדווח לערוץ הקבוע** |

**Scoping:** pre-commit רץ **תמיד**. pre-push: `local_sha` אפסים (מחיקה) או `remote_sha` לא-אב על `_PROTO_REFS`/main ⇒ exit 1; `--mirror` · `--prune` · `:ref` — חסומים ב-pre-tool.
**אירועי-git בלי hooks (אומת):** rebase-picks · `cherry-pick` · `git am` ⇒ commits בלי אף טבעת, עם trailer מועתק. **תשובה:** pre-push בודק freshness+ledger על **כל** commit בטווח (לא רק tip); pre-tool משכתב `cherry-pick X` ל-`cherry-pick --no-commit X && git commit`; `pre-applypatch` מותקן.
**Tiering הפוך:** דילוג על המשטרה רק אם כל ה-staged ב-allowlist (`*.md` מחוץ ל-`new/`·`machtzev/` · `knowledge/**` · `design/**` · `archive/**`).
**`police --inc`:** `census/import-graph.mjs` (חדש — `generator/atlas.mjs` הוא קטלוג, לא גרף): Dart relative+package (חיצוני = לא צרכן), JS static; **`import(` דינמי ⇒ "צרכנים לא ידועים" ⇒ מלא.** `contract`/`wiring`/`mutation` מקבלים `--files` (שינוי בסקריפטים הנעולים, §12 c4). > 50 קבצים ⇒ מלא.
**מקביליות:** `flock` על fd (משתחרר במות התהליך — לא קובץ-lock) · מחוללים דרך `outDir()` = `GEN_OUT ?? new/dart-gen-bs` (13 סקריפטים, כולל `board-gen:523` שמחשב import יחסית) · `.gitattributes`: `TRUTH.md WIRING.md merge=regen`, driver מוגדר ב-self-heal (fresh clone בלי driver = conflict markers ⇒ שער `no-conflict-markers`) · **בלי `union`** ל-LEARNINGS (L-id ייחודי-לclone מספיק; `learn-parity` דוחה RULE/GATE כפולים).
**merge/pull:** `merge --squash`/`--no-commit`/conflict-resolution ⇒ pre-commit רגיל ✓ · `--ff-only` ⇒ אין commit, אין hook, נכון (tree = remote).

---

## §4 · מנועי-hook (5; היו 7 ב-v3, 12 ב-v2)

> מנוע-hook רץ בתוך `git commit` של **המתזמר**. סוכן-גל לעולם לא git (דיבר-7). מנוע כותב ומוסיף ל-index דרך `GIT_INDEX_FILE` (אומת: plain · `-a` · `<paths>` · `--only` · `--amend`); `post-commit` מסנכרן את ה-index האמיתי. כשל-מנוע = שער-שארית `<id>-fresh` אדום עם stderr.

| # | מנוע | מייצר | איך | שער-שארית |
|---|---|---|---|---|
| M1 | `truth-write` | `TRUTH.md` + בלוק `<!-- truth:begin/end -->` ב-`CLAUDE.md` (הבלוק פטור מ-pin, לא הקובץ) | `git checkout-index -a --prefix=$TMP/` (0.36s/50MB) ⇒ `node $TMP/machtzev/truth.mjs --write --no-floor` ⇒ stage (כל הנתיבים ב-truth/render-ds יחסיים-ל-`import.meta` — לכן מריצים את **העותק**, לא דגל `--index`). **בלי `measurer:`** (טאוטולוגי; הרפרנס = tag ב-§5) | `truth-fresh` (commit) · `truth` (push: TRUTH ≡ `atom-index-full.json`) |
| M2 | `wiring-doc` | `WIRING.md` | `tools/gen-wiring-doc.mjs` על העותק | `wiring-fresh` |
| M3 | `index-add` | שורה ב-`INDEX.md` | רק `.mjs` חדש עם docline `/** … */` | `index-complete` (push) |
| M4 | `learn-draft` | `## L<תאריך>-<gate>-<sha6>` + `GATE:` + `ref: <blob-sha>:<path>:<lines>` לפני/אחרי (**לא hunks inline** — סודות/גודל) | `ANTIPATTERN:`/`RULE:` ריקים לסוכן | `learn-on-retry` (§8) |
| M5 | `ledger-stamp` | `ran\|skipped\|yellow\|failed <id> <ms> [tool=]` ⇒ `.git/protocol_ledger`; `commit-msg` חותם `Protocol-Ran: <sha256(tree-id‖ledger)>` (דוחה >1 שורה); `gates.tsv` עמודת-`layer ∈ {commit,push,ci}` | | `gates-ledger` (commit: ok אם status ∈ {ran, yellow}; push: ran בלבד אלא `Allow: yellow-push`; CI: ran) |

**נמחקו ב-v4:** session-card-עם-הרצת-DoD (M5 של v3 — RCE בתוך האכיפה; DoD חוזר להיות שדה-טקסט + שם-בדיקה שחייב להופיע ב-diff, **בלי הרצה**) · `test-scaffold` (M7 — "חצוב" לא ניתן-להכרעה מבייטים; `contract` כבר חוסם).

### §4.2 צהוב (L34) — מוגבל
- סיווג ב-`police.mjs`: **`e.code` קודם** (`ETIMEDOUT` ⇒ `yellow:timeout`, `ENOENT` ⇒ `yellow:tool`), `e.signal` ⇒ `failed`, אחרת `status` (2 ⇒ yellow, 1 ⇒ failed). `killSignal: 'SIGKILL'`, `detached: true` + `process.kill(-pid)` (נכד של Dart לא שורד timeout).
- **צהוב חייב לנקוב כלי:** `YELLOW tool=dart`; הטבעת מאמתת `command -v dart` נכשל. צהוב עם כלי-קיים ⇒ **אדום**. (סוגר "כל שער `exit 2` ועובר".)
- resolver אחד ל-Dart: `machtzev/dart-bin.mjs` (`DART_BIN` → `$HOME/dart-sdk` → PATH), משמש `boxes` **וגם `synth`** (היום מדלג בשקט); ה-ledger מדפיס גרסת-Dart.

### §4.3 sandbox לכל הרצת-בדיקה (חדש — חור קיים, לא של הפרוטוקול)
`contract-check.mjs:21` מריץ 1,239 `*.test.mjs` עם `env` מלא (GH_TOKEN, AWS_*, proxy), fs מלא, בלי timeout. v4: `env: {PATH, HOME}` · `cwd` = עותק זמני של האטום · `timeout` 15s · `--experimental-permission --allow-fs-read=<atom-dir>` · אין רשת. חל גם על `mutation` ו-`selftest`.

---

## §5 · העד — ראצ׳ט-כיוון + מאמת-עצמאי שבאמת מודד

**הכרעה F:** אין חסימה חיצונית. הוספה/החמרה חופשית. החלשה — נראית.

### §5.1 מה לא עבד ב-v3 (ואומת)
"כלים מה-tag על העץ הנוכחי" — 17/21 סקריפטים כובלים את העץ ל-`import.meta.url`; `police.mjs` מעביר `HERE + '../new'`. המאמת היה מודד tag-על-tag, ירוק תמיד, ומקדם את ה-tag לנצח. ה-selftest של ה-tag מריץ את הסקריפטים של ה-tag — לא מוכיח דבר על HEAD. ה-tag עצמו: lightweight, שם צפוי, לא ב-origin, הסוכן יכול ליצור/להזיז/לדחוף. ה-Routine ניתן-לעריכה ע"י הסוכן ואין רישום. "הודעה לבעלים" — בלי ערוץ.

### §5.2 המאמת v4 (8 צעדים, ניתנים-להרצה אחרי שלב 0)
1. **זהות:** ה-SHA הידוע-הטוב נשמר **מחוץ לריפו** (זיכרון ה-Routine / gist של הבעלים). ה-tag `protocol-good-*` הוא מראה אנושית. `rev-parse tag ≠ SHA-רשום` ⇒ דוח-tamper, אין ריצה. (הכרעה L: tag-protection על `protocol-good-*` בלבד — אפס חיכוך יומי.)
2. **Fetch:** clone מלא + `--tags`; Dart + `typescript` vendored; `env -i`.
3. **Materialize:** שני worktrees (T, H) + עותק-H להזרקת-רעל. קריאת `gates.tsv`/baselines/`police.mjs` דרך `git show <sha>:<path>` — לעולם לא מעץ ששער רץ בו.
4. **כיוון פר-commit** (זול, על **כל** commit ב-`T..H`): tuples `gate(id, script, skip)` מ-`police.mjs` (regex `gate(?:Dirty)?\('([^']+)',\s*'([^']+)'`) — id→script לא-יורד, אין `skip` חדש; **מניפסט-baselines** (`gates.tsv` עמודות `baseline=<path>;dir=shrink|grow`) עם סמנטיקה לכל קובץ (מערכים=shrink, מפות-מספריות=grow, map-of-arrays=grow); אין `exit(2)` חדש בשער שלא היה בו.
5. **הוכחת-ירי** (הראיה היחידה): הסקריפטים של **H** על הרעל של **T** מוזרק **בנתיב האמיתי** בעותק-H, תחת `MACHTZEV_ROOT` (§12 c3: root אחד לכל 21 הסקריפטים) ⇒ בדיוק `1`; על נקי ⇒ `0`. `unproven` (שערים בלי זוג) **לא עולה** T→H. סקריפט-נעול שה-hash שלו השתנה בלי זוג ⇒ unproven.
6. **שתי משטרות מלאות:** H-tools על H-tree · T-tools על H-tree (`MACHTZEV_ROOT=H`). צהוב/skipped/קריסה בכל אחת ⇒ **אין קידום**.
7. **קידום:** ירוק **+ ack של הבעלים** בערוץ (או lag 24h שבו הדוח נראה ואף ריצה לא חלקה). לעולם לא אוטומטי, לעולם לא על צהוב/unproven.
8. **דוח תמיד** (ירוק/צהוב/אדום/קרס) לערוץ קבוע אחד (issue-thread בריפו-בעלים או `send_later` מייל), עם SHA-tag, SHA-HEAD, טבלה פר-שער, **hash של הגדרת-ה-Routine עצמה**. חוק-הבעלים: שקט = אדום.

**חלון:** המאמת רואה HEAD פעם ביום; `police.yml` על push (non-required) הוא העד לביניים. שניהם מדווחים לאותו ערוץ.

---

## §6 · `pre-tool.sh` — מה הוא באמת

**הטענה הכנה:** tripwire על ההרגלים של המודל, לא מסנן-פקודות. `bash /tmp/s.sh` · `node -e "execSync(...)"` · `git commit-tree | update-ref` · `git config --global alias` · `curl`+`GH_TOKEN` — כולם עוברים ויעברו. הראיה לריצת-hooks = CI-עד שמריץ `police` מחדש, לא ה-tripwire.

| מה | איך |
|---|---|
| matcher | `.*`; allowlist Read/Grep/Glob/Agent/…; **`permissions.deny: ["mcp__github"]`** (השרת כולו; wildcards בשמות-MCP לא נתמכים) + allow מפורש לכלי-קריאה. חל רק כשההגדרות הן של **הפרויקט הזה** — כל ריפו שהסוכן מבצע בו commit צריך `.githooks` + `.claude/settings.json` משלו (המחצב היום: אף אחד) |
| git — tripwire | `-n`/`--no-verify` · `--force*`/`+ref`/`--mirror`/`--prune`/`:ref` · `-c core.hookspath` (case-insens., **כתיבה** בלבד; קריאה מותרת — היום buildsmart חוסם קריאה) · `commit-tree`/`update-ref` · `cherry-pick` בלי `--no-commit` · `checkout/restore/apply/stash pop/reset --hard` על נתיב-מוגן |
| קבצי-הגנה (suffix על נתיב מוחלט) | PINNED (§7.3) + מחוללים (`TRUTH.md` · `WIRING.md` · `atom-index*.json` · `logic-census.json`) — Edit/Write ⇒ 🔒 אלא אם trailer `Allow:` ב-HEAD מתאים |
| self-heal | `hooksPath` · `chmod +x` · `merge.regen.driver` — **נוחות ל-clone טרי**, לא הגנה (מי שהחליף hook — self-heal מפעיל את שלו). **בלי** כלל `toplevel ≠ project` (היה נועל את הסשן הזה) |
| חוקי-מחצב | `git checkout -- .` בגנסיס (T2) · `sleep` (T3) · `one.mjs`/`truth --write` על עץ לא-נח · `--baseline`/`--write` על ratchet בלי trailer · `pins-check --write` בלי trailer |
| fail-closed | `command -v jq \|\| exit 2` · root מ-`cwd` ב-JSON של ה-hook, לא מ-`$CLAUDE_PROJECT_DIR` (ריק בתת-סוכנים) |

**ALLOW = trailer, לא קובץ.** `Allow: <kind>:<scope> <L-id|הכרעה-N>` בגוף ה-commit; `commit-msg` + CI מאמתים פורמט; kinds: `pins-write:<glob>` · `baseline:<file>` · `floor:<n>` · `corpus` · `yellow-push` · `push-main`. אין קובץ, אין deadlock, אין הצטברות. **fixtures עוברים ל-`machtzev/selftest-fixtures/` (לא נעול)** — לקח לא דורש `pins-write`.

---

## §7 · השערים (ספירה מ-`gates.tsv`; כאן שמות)

### §7.1 commit
**הגנה:** `hooks` (hooksPath · executable · `.githooks/` קיים **בworktree הזה**) · `layers` (רק מה ש-`gates.tsv` מצהיר לשלב) · `pins` · `exit-direct` (סריקה סטטית של `.githooks/*` ל-`| tail/head/grep` ו-`& nohup setsid disown`) · `no-conflict-markers`.
**staging:** `secrets` (patch בלבד) · `nobinary` · `no-registry` · `gitignore-guard` · `no-export-ignore` (`.gitattributes`) · `session` (Owner · Scope · DoD-שם-בדיקה-ב-diff, **בלי הרצה**).
**ratchets:** `ratchet-down` (set-subset מול **merge-base**; שערים לא כותבים — `ℹ️ baseline may shrink`) · `truth-gate` מול merge-base.
**למידה:** `learn-on-retry` · `antipattern-scan` · `stuck-loop`.
**`police --inc`** + `truth-fresh` · `wiring-fresh` · `gates-ledger`.
**מדדים:** `wired-delta` · `protocol-tax`.

### §7.2 push (worktree detached · freshness לכל commit בטווח · ratchets מול merge-base)
`police` מלא + `mutation-dart` · `hebrew-in-engine` · `goal-anchor` (hash sha256-8 של השורה-המעוגנת) · `dedup` · `exempt-count` · `wordlist-ratchet` · `atom-count` (מספר-אטומים לאזור לא יורד — 1.7 שהושמט) · `selftest-coverage` (זוג: 1 בדיוק / 0; `run()` גולמי; ראצ׳ט מ-3, baseline ב-`gates.tsv`) · `learn-parity` · `truth` · `index-complete` · `onestatus-fresh` · `flag-reversible` · `baseline-shrink` (מחיל כיווצים) · `dup-class` (הכרעה K) · שמירת-ענף.
**מתוקנים:** `mutation` רקורסיבי, fail-closed על export, hollow שומר-טיפוס · `contract` דוגמה-מספרית + import + assertion, `--files` · `oracle --gate` = **הליכה-בזיכרון** (`atomIndex()` + `logicCensus()`) ≡ committed — השער החי היחיד בשרשרת TRUTH→full→index (`atom-census.json` **נמחק**; `render-ds:980` ו-`truth:19` קוראים `atom-index.json`) · `coverage` מפוצל: `coverage-static` (push) · `coverage-dart` (`layer=ci`).

### §7.3 CI-עד — `police.yml` (non-required)
```
G0  ראצ׳ט-כיוון מול tag (§5.2 צעדים 3–5, ללא קידום)     G6  selftest-coverage · learn-parity · liveness (seed אקראי)
G1  pins-check (נגזר ≡ כתוב, 64-hex)                       G7  gen-wiring-doc → diff ריק · onestatus-fresh · oracle-walk
G2  police מלא — צהוב = אדום · ledger מודפס                 G8  compile: dart analyze על new/dart-* + behavioral/run.mjs · Protocol-Ran נוכח
G3  truth ≡ oracle · CLAUDE truth-block                     G9  ratchets מול github.event.before / merge-base · floor-advance (bot commit)
G4  hooks/settings/workflow ≡ pins                          G10 protocol-tax (CI-only)
G5  audit_gates.mjs — כל שער-commit/push חוסם על הפרה מוזרעת (clone זמני + hooksPath)
```
**PINNED (נגזר):** STATIC (`LAW` · `CLAUDE` · `VERIFY-LAWS` · `THE-WAY` · `AGENT-CODE` · `DECISIONS` · `PURPOSE` (שורש) · `gates.tsv` · `.githooks/*` · `.claude/*` · `police.yml` · baselines · `wired-floor.json` · `acceptance-space.txt` · `truth.mjs` · `render-ds.mjs` · `census/*` · `coverage-gate.mjs` · `tools/gen-wiring-doc.mjs` · `one.mjs` · `dart-bin.mjs`) ∪ DERIVED (`/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'/gm` ⇒ `machtzev/$2`). בדיקה דו-כיוונית, הדפסת שני ה-diffs.

---

## §8 · למידה v4 — הוכחה מול ההיסטוריה, לא מול פרוזה

```
כשל-תוכן ⇒ retry.jsonl (tracked, machtzev/audit/): {gate, path, sha, blob-before}
retry ⇒ M4: ## L<תאריך>-<gate>-<sha6> · GATE · ref: <blob>:<path>:<lines> לפני/אחרי
הסוכן: ANTIPATTERN: <regex>   RULE: <משפט>
learn-on-retry: regex תקין · match(git show <blob-before>) · !match(<blob-after>)
               · דחייה אם regex == regex-escape של substring מ-blob-before (הליטרל)
               · חייב לפגוע גם ב-fixture המוזרע (selftest-fixtures/) — אחרת "אנטי-פטרן מת", מחוץ ל-parity
retry #3 ⇒ stuck-loop 🚨 ⇒ בעלים. אין allow-retry.
```
`LEARNINGS.md` נכנס ל-PINNED-STATIC (הראיה לא יכולה להיות בקובץ שהסוכן עורך חופשי — עריכה = `Allow: pins-write:LEARNINGS.md`, שהיא רק tag-ביקורת). מיגרציית L1–L47: `GATE:` לכולם (E).

---

## §9 · timeouts · lock · מס · גיזום

| | |
|---|---|
| timeout פר-id | commit 15s · push 120s · CI 600s; ילדים: `mutation` 15s/test · `boxes` 120s/proof אבל **סה"כ-טבעת** נאכף (62 הוכחות ≠ 124 דק׳) |
| timeout = | `yellow:timeout`, מוצהר, SIGKILL לקבוצת-תהליכים, לעולם לא `ran` |
| lock | `flock` על fd; אין קובץ-lock |
| stats | מקומי = תצוגה; CI artifact = הקובע |
| גיזום | לעולם לא על שקט; רק עלות (>20s ב-commit) / liveness-כושל / הכרעה ממוספרת |

---

## §10 · כרטיס-המצב — בנוסף לסדר-הקריאה (עד H)
סדר-הקריאה בפועל = 821 שורות (+398 WIRING +294 PROTOCOL). הכרטיס (≤20 שורות) נוסף, לא מחליף, עד הכרעה H. `session-start`: hooksPath+driver שורה 1 · Dart אטומי (`.partial`+rename, `timeout: 600`, כשל = צהוב) · fetch+SHA · כרטיס.

---

## §11 · הכרעות-בעלים

| # | שאלה | מוצע |
|---|---|---|
| A | push | 21ג/T1 גוברים עד רשומה ממוספרת; `ff-push` + `remote_ref`-guard; main לעולם לא בלי `Allow: push-main` |
| B | `one.mjs` דוחף ל-buildsmart | דרך `ff-push.mjs`, אחרי police ירוק |
| **C** ✅ | אורקל-אחד | **`atom-index.json` צודק (554 = שני הסורקים חיים).** `atom-census.json` **נמחק** (תת-קבוצה, אפס צרכנים ייחודיים); `render-ds`+`truth` קוראים index; `oracle --gate` = הליכה-בזיכרון ≡ committed; TRUTH/CLAUDE → 1364/554 |
| D | ענף | שניהם ב-`_PROTO_REFS`; CLAUDE מתוקן |
| E | מיגרציית L1–L47 | כן |
| **F** ✅ | חסימה חיצונית | **לא.** ראצ׳ט-כיוון + מאמת-עצמאי (§5.2) + CI-עד non-required |
| G | תקרות | 60s · 20s/id · 10 דק׳ |
| H | סדר-קריאה | CLAUDE גובר עד הכרעה |
| **I** | הגדרת `wired` | פלט-`renderCompose` על קורפוס נעול, לצד הנגישות; **N:** מול `eligible` (543), לא 1364 |
| J | `gen_app_*.dart` | scratch (`.gitignore` + `git rm` פעם אחת; `outDir()`) |
| **K** 🆕 | **8 שמות-מחלקה כפולים** | סורקים יוצאים 1 על כפילות; הבעלים בוחר: rename ל-`Premium*` או `key = file+cls` |
| **L** 🆕 | tag-protection על `protocol-good-*` בלבד (חיצוני-זעיר, לא חוסם קוד) | כן — אחרת ה-tag בשליטת הסוכן |
| **M** 🆕 | `police.yml` על push כעד (non-required) | כן — F אסר חסימה, לא ראייה |

---

## §12 · Bootstrap — שלב 0 = 5 commits (תחת כללי v1: `pins --write` באותו commit, trailer `Bootstrap: pre-ALLOW`)

> **✅ בוצע 3.9.2026 (מקומי, לא נדחף):** c1 `6073989` · c2 `61fdb0a` · c3א `3a5233c` · c3ב `a43c064` · c3ג `eb8f781` · c4א `5eb9d77` · c4ב `5e4134d` · c5 `e2bc2c9` · c5ב `cef8e77` · tag `protocol-good-2026-09-03` → `e2bc2c9`.
> **נמדד בסוף:** משטרה מלאה `21 ran · 0 skipped · 0 yellow · 0 failed` (2.7 דק׳) · selftest 17/17, זוגות **5/21** (היו 3) · pins **57** (היו 11, 16-hex) · אמת: **1402** = 554 + 848 (שני האינדקסים היו ישנים; `oracle --gate` תופס מעכשיו) · eligible 534 · wired 53.
> **ממצאים תוך-כדי (השערים עשו עבודה):** `synth` נכשל ברגע ש-Dart נמצא — באג-רתמה (List.toString) שהוסתר שנים · `genratchet` האדים על הערה-עברית שלי בקוד · sandbox חשף 4 סודות-סביבה גלויים ל-1,239 בדיקות · הראצ׳ט-איכות מנע אכיפה שהייתה מאדימה 617 חוזים.
> **המאמת-העצמאי אומת בשלושה כיוונים:** (1) `--expect-sha` שגוי ⇒ `TAMPER` exit 3 · (2) T=tag, H=`cef8e77` (commit כן) ⇒ **ירוק**: 0 החלשות · זוגות 5→5 · H-על-H ו-T-על-H שניהם 21/21 · (3) ענף זמני עם `skip=true` על `freeref` ⇒ **אדום** "skip חדש: freeref=true" — בעוד המשטרה של אותו HEAD אמרה על עצמה "ירוקה, 20 ran · 1 skipped". זו בדיוק הנקודה העיוורת שהמאמת קיים בשבילה.
> **📌 נדחף 3.9 ("תדחוף"):** `claude/hei-rxv1v1` = `79fd58b` (אחרי שני rebase על origin: +17 · +1 commits של סשן מקביל; חפיפה רק ב-TRUTH/pins, חודשו). **סימון-ידוע-טוב = ענף** `protocol-good-2026-09-03` → `79fd58b` — ה-proxy של הסשן דוחה דחיפת tags ("remote end hung up"), ענף עובר; המאמת מקבל כל ref. ה-SHA הרשום מחוץ לריפו (ל-`--expect-sha`): `79fd58b`.
> **🔒 מצב-הפעלה (הכרעת-בעלים 3.9): הפרוטוקול נדחף אבל אינו פעיל.** אין hook מותקן, `session-start.sh` אינו מפעיל `core.hooksPath`, אין CI, אין Routine — כל שער רץ רק ביד (`node machtzev/police.mjs`). האכיפה האוטומטית (שלב 1 ומעלה) מתחילה **רק באישור מפורש של הבעלים**.
> **מה עדיין לא:** Routine המאמת — **חסום על push** (מ-clone נקי origin עדיין ב-`e29f96e`); `--inc` = stub (מריץ מלא); `outDir()` קיים אבל `gateDirty` עדיין snapshot/restore; הכרעות K · L · M · N פתוחות.

| c | תוכן | DoD |
|---|---|---|
| **c1** | `typescript` vendored (`machtzev/package.json`+lock, `.gitignore` += `node_modules/`); `free-ref-scan:6`, `deep-purity-scan:29` → `createRequire(import.meta.url)`, חסר ⇒ `exit 2 tool=typescript`. **לא נעול** — בלי pins-write | `node machtzev/emit/free-ref-scan.mjs --gate; echo $?` ⇒ `0`; בלי node_modules ⇒ `2` |
| **c2** | `police.mjs`: סיווג `e.code`→`status`, yellow-עם-כלי, ledger 4-מצבים (skip ≠ ran), `killSignal`+`detached`, `flock`, `--inc` stub (`ℹ️ inc → full: no-graph`); `dart-bin.mjs`; `synth` בלי Dart ⇒ 2. + pins-write | `node machtzev/police.mjs; echo $?` ⇒ `21 ran · 0 skipped · 0 yellow` + `0` (Dart 3.7.2 קיים כאן) |
| **c3** | **`MACHTZEV_ROOT`** בכל 21 הסקריפטים + `police.mjs` (`new URL(process.env.MACHTZEV_ROOT ?? '..', import.meta.url)`) · `outDir()` ב-13 · `contract`/`wiring`/`mutation` `--files` · `mutation` רקורסיבי/fail-closed · `contract` דוגמה+assertion+sandbox · שערים **לא כותבים** baselines · `truth --no-floor` · eligible. + pins-write | `MACHTZEV_ROOT=/tmp/copy node machtzev/police.mjs` מודד את העותק (הוכחה: שינוי בעותק בלבד משנה את הפלט) |
| **c4** | `pins-check`: 64-hex, PINNED נגזר+מורחב, דו-כיווני · `police-selftest`: `run()` גולמי, זוגות, fixtures ל-`selftest-fixtures/` · `gates.tsv` +layer +baseline-manifest · `oracle --gate` הליכה-בזיכרון · מחיקת `atom-census.json` (C) · `dup-class` (K) | `pins-check` ⇒ `✓ N`; police עם `gate('x','x.mjs')` זמני ⇒ `1`; זוגות: מורעל 1 / נקי 0 לכל שער שנגע |
| **c5** | `TRUTH`/`CLAUDE` (truth-block) → 1364/554 · tag `protocol-good-<תאריך>` על HEAD **ירוק-מלא** · Routine המאמת (§5.2) עם SHA מחוץ לריפו · ערוץ-דיווח | ריצת-מאמת ראשונה: `gates ⊆ · tuples ⊆ · baselines-dir ✓ · fires 21/21 (unproven 0)` בדוח |

**אחר כך:** 1 hooks (§3, כולל `pre-applypatch`/`post-commit`/`post-rewrite`, `.gitattributes`, `import-graph.mjs`) · 2 `pre-tool` + `settings.json` **במחצב** · 3 CI-עד G0–G10 · 4 למידה v4 + מיגרציה E · 5 שערים חסרים + I/N · 6 trailers ALLOW + כרטיס · 7 נחיל (`wave-partition` וכו׳) · 8 `audit_gates` + `mutation-dart` + גיזום. כל שלב: DoD פקודה⇒פלט, גל ≤10 (L20 נבדק בשדה `Wave:` של הכרטיס), תקוע 2/3 ⇒ בעלים.

---

## §13 · D3
- `police` מלא **כן** רץ כאן חלקית (`boxes` 62/62 עם Dart 3.7.2); `selftest`/`mutation` מלא לא הורצו (≥ 2 דק׳).
- ממצאי git-hooks (rebase/cherry-pick/am/post-rewrite/GIT_INDEX_FILE/worktree) — אומתו אמפירית ע"י עדשה 2 ב-repo זמני, git 2.43; לא חזרתי עליהם.
- `permissions.deny` על שם-שרת-MCP — לפי תיעוד שלא זמין מקומית; מסומן כלא-מאומת.
- `selectVaried` tie-semantics, `spec-acceptance` כאב-טיפוס להכרעה I — קריאת-קוד ע"י עדשה 4.
- זמנים: `contract` 59.6s · `truth` 9.3s · `boxes` 30.7s · `checkout-index` 0.36s — נמדדו; "≤ 20s ל-commit" = יעד שתלוי ב-`--files` (c3).
- ספירות = טבלאות עד `gates.tsv` (c4).

---

## נספח א׳ · מה נמחק/שונה מ-v3 (מפתח: ממצא סבב-2)
| v3 | v4 | ממצא |
|---|---|---|
| מאמת "כלים מ-tag על HEAD" | `MACHTZEV_ROOT` בכל סקריפט (c3); רעל-T מוזרק ל-H; שתי משטרות; אין קידום אוטומטי; SHA מחוץ לריפו; דוח תמיד | R2-1.1–1.12 |
| `pins(tag) ⊆ pins(HEAD)` | נמחק (vacuous); סקריפט-שהשתנה-בלי-זוג = unproven | R2-1.9 |
| `gates ⊆` על ids | tuples id→script + skip | R2-1.10 |
| ALLOW-tracked file | trailer `Allow:` | R2-3.1, 3.2, R2-5.8 |
| M5 מריץ DoD-test | שם-בדיקה ב-diff, בלי הרצה; sandbox לכל הרצה | R2-3.5 |
| M7 test-scaffold | נמחק | R2-3.6 |
| hunks inline ב-LEARNINGS | `ref: blob:path:lines`; LEARNINGS נעול | R2-3.4 |
| `toplevel ≠ project ⇒ 🔒` | נמחק; hooks פר-ריפו | R2-3.11 |
| deny רשימת-כלים | `mcp__github` כולו; הודאה ב-`gh`/`curl` | R2-3.12 |
| "parse חיובי" | tripwire, בכנות | R2-3.8 |
| `git archive $sha` | `worktree add --detach` + `NODE_PATH` + `no-export-ignore` | R2-2.5 |
| `post-rewrite` מחדש+amend | מסמן REGEN_NEEDED; pre-push freshness לכל commit | R2-2.1, 2.2 |
| trailer עם hash-ledger | `sha256(tree-id‖ledger)`, presence ב-CI, דחיית כפילות | R2-2.3 |
| `.git/police.lock` | `flock` fd | R2-2.9 |
| `e.status===2` | `e.code` קודם; SIGKILL; process-group | R2-2.8 |
| `GEN_OUT` env (לא קיים) | `outDir()` ב-13 סקריפטים | R2-2.11 |
| `merge=union` LEARNINGS | נמחק | R2-2.6 |
| `census` → index → full | `atom-census.json` **נמחק**; `oracle --gate` הליכה-בזיכרון | R2-4.1, 4.11 |
| `measurer:` ב-TRUTH | נמחק | R2-4.6 |
| `claudemd-numbers` regex | truth-block עם markers | R2-4.7 |
| `floor-advance` ב-pre-push | CI bot-commit; `--no-floor`; ירידה = `Allow: floor` | R2-4.5, R2-5.7 |
| `wired` מול 1364 | מול `eligible` 543 (N) | R2-4.10 |
| `coverage` live-or-yellow | פיצול static/dart | R2-4.9 |
| gates-ledger חוסם על צהוב | commit: {ran, yellow} ok | R2-5.5 |
| שלב 0 = "שלב" | 5 commits bootstrap תחת v1 | R2-5.1 |
| "אין Dart כאן" | Dart 3.7.2 קיים; `synth` מדלג בשקט | R2-5.2 |
| 60s עם `contract` 60s | `--files` בסקריפטים הנעולים | R2-5.3 |
| `census/atlas` כגרף | `import-graph.mjs` חדש; dynamic import ⇒ full | R2-2.12, 5.4 |
