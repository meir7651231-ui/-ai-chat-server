# 🔴 RED-TEAM של PROTOCOL v2 — 6 עדשות · 70 ממצאים · ההכרעה לכל אחד

> **מה זה:** יומן-התקיפה על `PROTOCOL.md` v2 (2.9.2026). שישה מבקרים קריאה-בלבד, כל אחד עדשה אחת, כל ממצא עוגן ב-`קובץ:שורה` ואומת מול הקוד החי. אחריהם — אימות-עוין שלי על הטענות המכריעות (בייטים, §אימות למטה).
> **התוצאה:** v2 נפל ב-4 נקודות מבניות. v3 (`PROTOCOL.md`) נבנה סביב התיקונים. כאן: הממצא · חומרה · מה v3 עושה איתו (✅ תוקן · 🟡 סיכון-מקובל מתועד · ❓ הכרעת-בעלים).

## ארבעת השברים המבניים (מה שכל עדשה מצאה בנפרד)
1. **אין שורש-אמון מחוץ לעץ.** CI בודק את ה-commit עם הכלים שבאותו commit. עורכים `police.mjs` + מחשבים `pins.sha256` מחדש ⇒ הכל ירוק. (עדשות 1·2·3)
2. **Scoping לפי הענף המקומי = דלת פתוחה.** ענף `tmp` ⇒ אפס שערים ⇒ `push tmp:hei-rxv1v1` / merge / MCP `push_files`. (1·3·6)
3. **הפועלים מייצרים זבל שנראה מאושר.** regex מהשגיאה, fixture חלול, TRUTH מעץ-לא-נח, מחיקת קבצי-מוצר, `process.env` באטום. (4·5·6)
4. **המספרים משקרים בעקביות.** `skipped=ran`, `wired` = זוכי-תיקו בהגרלה, baseline לפי-אורך, ספירות במסמך שלא מסתכמות. (2·5)

---

## עדשה 1 · עקיפה (12)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 1.1 | `git commit -n` (קיצור `--no-verify`), `hookspath` באותיות-קטנות, `GIT_CONFIG_COUNT` env — לא חסומים | CRITICAL | ✅ §6: parse-חיובי של argv; `-n` · `-c` · `GIT_CONFIG*` · `GIT_DIR` · `git -C` · `--git-dir` חסומים; `hookspath` case-insensitive; CI דורש trailer `Protocol-Ran` |
| 1.2 | ענף לא-מוגן ⇒ `exit 0` ⇒ merge / `push tmp:proto` / `pre-merge-commit` לא קיים | CRITICAL | ✅ §3: pre-commit רץ **תמיד**; pre-push סקופ לפי `remote_ref`; `pre-merge-commit`=pre-commit; push-ring רץ על `git archive $sha`; ruleset על ענפי-הפרוטוקול |
| 1.3 | `mcp__github__push_files` / `create_or_update_file` / `merge_pull_request` — מחוץ ל-matcher | CRITICAL | ✅ §6: matcher `.*` + `permissions.deny` על כלי-כתיבה של GitHub MCP; CI required-check |
| 1.4 | hooks מותקנים רק ב-session-start; `chmod -x`, clone טרי, `git -C` | HIGH | ✅ §6: pre-tool מאשרר hooksPath+executable **בכל קריאה** (self-heal); `chmod` חסום; CI: trailer חסר = אדום |
| 1.5 | tiered: קוד ב-`box-drafts/`·`screens-seed/`·`archive/`·`package.json`; שינוי `*.contract.md`/`*.test.mjs`/`*.data.json` בלי `.mjs` ⇒ "commit-תיעוד" | HIGH | ✅ §3: היפוך — מדלגים רק על allowlist-docs; contract/test/data ממופים לאטום-הבעלים |
| 1.6 | `.allow_*` — מונפקים ע"י הסוכן, "סיבה" לא נבדקת, `protocol_audit.log` ניתן למחיקה ולא נדחף | HIGH | ✅ §5: קובץ-ALLOW **tracked** ב-`machtzev/audit/ALLOW-<sha6>.md`, חד-פעמי, נדרש ע"י CI; 🟡 אישור-בעלים אמיתי = CODEOWNERS review בלבד (גבול כן) |
| 1.7 | ריקון: חוזה = `'#'.repeat(120)`, test = `console.log(1)`; `mutation` לא רקורסיבי; מחיקת אטומים לא-מחווטים חופשית | HIGH | ✅ §7: `contract` דורש דוגמה-מספרית + import של האטום + assertion; mutation רקורסיבי; ratchet על מספר-אטומים לאזור |
| 1.8 | reset-baseline מענף-צד; "keys ≤ HEAD" מנוצח ע"י rename; `coverage-baseline` לא נעול ומתעדכן-לבד | HIGH | ✅ §7: set-subset; כל baseline נעול; `--baseline` רק דרך ALLOW; השוואה ל-merge-base |
| 1.9 | fingerprint ב-`.git/` — `rm`, commit-תיעוד מזיז HEAD; `GIT_REFLOG_ACTION=rebase` מדלג | MED | ✅ §8: מפתח = (gate, path) ב-`machtzev/audit/retry.jsonl` tracked; אין replay-skip לפי env |
| 1.10 | `--inc`: `rethread-boxes` הוא CLI תלוי-Dart, אין `consumersOf`; קובץ בלי אטום-בעלים ⇒ 0 שערים ⇒ ירוק | MED | ✅ §3: גרף-imports סטטי; fail-closed ⇒ מלא |
| 1.11 | `RULE: fixed.` עובר; ANTIPATTERN מ-`file:line` לעולם לא תואם | MED | ✅ §8: ANTIPATTERN ידני, חייב לתאום את ה-hunk-לפני ולא את ה-hunk-אחרי |
| 1.12 | `protocol_stats.jsonl` ניתן-לכתיבה ⇒ גיזום מזויף | LOW | ✅ §9: רק סטטיסטיקת-CI מזינה גיזום |

## עדשה 2 · רמאות-מדדים (12)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 2.1 | `truth.mjs`·`render-ds.mjs`·`census/*`·`coverage-gate.mjs` לא נעולים ⇒ "TRUTH ≡ מדידה" מעגלי | HIGH | ✅ §5: PINNED נגזר אוטומטית מ-`police.mjs gate()` + מחוללים; hash-המודד נחתם בתוך TRUTH.md |
| 2.2 | `atom-census.json`/`logic-census.json` — קלט tracked שאף שער לא מחדש; לא ברשימת-ההגנה; P1 נועל ניפוח לרצפה | HIGH | ✅ §7: `census --gate` (חידוש-בזיכרון + diff); הרצפה זזה רק ב-push אחרי `oracle`+`coverage` ירוקים |
| 2.3 | `wired` = זוכי-תיקו ב-`selectVaried` (400 seeds) — 30 stubs זהים = +30; שיפור אמיתי מוריד את המספר | HIGH | ❓ הכרעה I: הגדרת "מחווט" = מופיע באפליקציה שנבנתה מה-spec-corpus (`genratchet`), לא זוכה-בהגרלה |
| 2.4 | `--fast`: מדולג נספר `ran`; DoD שלב-0 "21/21" מסופק בלי מוטציה | HIGH | ✅ §4: ledger `ran/skipped/yellow/failed`; `16 ran · 5 skipped`; DoD = מלא |
| 2.5 | baselines הם **מערכים** ⇒ "keys ≤" = אורך; heal-1+add-1 = אותו אורך | HIGH | ✅ §7: `Set(staged) ⊆ Set(HEAD)` + הקובץ-שהוסר ירוק באותה ריצה |
| 2.6 | CI `HEAD~1` + push של 2 commits מסתיר reset | HIGH | ✅ §9: `fetch-depth: 0`, השוואה ל-`github.event.before` / merge-base |
| 2.7 | `selftest-coverage`: כל non-zero = "יורה", כולל קריסה ו-`exit 2`; תג בהערה | HIGH | ✅ §7: fixture = **זוג** (מורעל⇒1 · נקי⇒0), `run()` מחזיר קוד גולמי, 2 לא נספר |
| 2.8 | mutation: `export default` ⇒ `names=[]` ⇒ דילוג-שקט; hollow=`undefined` ⇒ `typeof` מספיק; A→box→B לא נראה | MED-HIGH | ✅ §7: fail-closed על צורת-export לא-מפורסרת; hollow שומר-טיפוס; `--inc` מריץ הוכחות-קופסה של הצרכנים (או twins) |
| 2.9 | `coverage` קורא `dart-tests-passing.json` לא-מאומת וכותב baseline בכל ריצה ירוקה | MED | ✅ §7: `testProven` מריצה חיה או `exit 2`; baseline רק ב-push דרך ALLOW |
| 2.10 | `learn-parity`/`antipattern-scan` — שוויון-ספירות מרופד; `(?!)` מספק | MED | ✅ §8: כל L שומר hunk-לפני/אחרי; regex חייב match-לפני & !match-אחרי; "אנטי-פטרן מת" מחוץ ל-parity |
| 2.11 | גיזום-על-שקט מסיר את ההרתעה; liveness עם seed קבוע | MED | ✅ §9: אין גיזום על שקט; רק על עלות / liveness-כושל; seeds אקראיים |
| 2.12 | protocol-tax: `&`/`setsid` מסתיר; stats לא מוגן; CI לא רואה מקומי | MED | ✅ §9: `exit-direct` אוסר `& nohup setsid disown` ב-hooks; מדידה משעון-git; רק CI-stats מזינים |

## עדשה 3 · הגנה-עצמית (12)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 3.1 | ל-CI אין שורש מחוץ ל-commit; `pins-check` נועל את עצמו; workflow בעץ | HIGH | 🟡 הכרעה F: אין חסימה. במקום: מאמת-עצמאי מ-tag ידוע-טוב + ראצ׳ט-כיוון (§5.1) — החלשה **נראית** תוך יום, לא נחסמת |
| 3.2 | חמשת `.allow_*` — נכתבים ע"י הנאכף, gitignored, ללא TTL | HIGH | ✅ 1.6 |
| 3.3 | "הקיר" על `main` שאיש לא כותב אליו; ענף-העבודה לא מוגן לעולם | HIGH | 🟡 הכרעה F: ענף-העבודה לא נחסם; המאמת-העצמאי רץ **עליו** (לא על main) יומית. אופציונלי: restrict-path על `police.yml` בלבד |
| 3.4 | scoping לפי שם-ענף-מקומי | HIGH | ✅ 1.2 |
| 3.5 | 14/21 סקריפטי-שער + כל המחוללים לא נעולים | HIGH | ✅ 2.1 |
| 3.6 | `chmod -x`, `tee`, `node -e`, `update-index` לא חסומים | MED | ✅ 1.4 + self-heal |
| 3.7 | hooksPath רק אם SessionStart רץ; `set -e`+`curl` מפילים לפני | MED | ✅ §6: hooksPath שורה 1; pre-tool מאשרר; curl-כשל = צהוב |
| 3.8 | `.git/hooks ≡ .githooks` — תיאטרון | LOW | ✅ נמחק |
| 3.9 | P10 ledger מדווח-עצמית; skipped=ran | MED | ✅ 2.4; ה-ledger הקובע = של CI |
| 3.10 | ratchet מול `HEAD~1` | MED | ✅ 2.6 |
| 3.11 | pre-tool fails-open (jq חסר, `disableAllHooks`) | LOW-MED | ✅ §6: `command -v jq \|\| exit 2`; matcher `.*`; 🟡 user-level settings = גבול כן |
| 3.12 | 16-hex = 64-bit | LOW | ✅ 64-hex מלא |

## עדשה 4 · הפועלים (12)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 4.1 | P8 כותב ל-`police-selftest.mjs` הנעול; גייטים `--gate` מתעלמים מ-fixture-dir; אין מקור לתוכן-מורעל ⇒ L27 | HIGH | ✅ **P8 נמחק.** fixture ידני, זוג (2.7) |
| 4.2 | P7 regex מהשגיאה = מת, או מהשורה = חוסם את התיקון; תווים לא-escaped | HIGH | ✅ §8: P7 מייצר כותרת+`GATE:`+`file:line`+hunks בלבד; ANTIPATTERN ידני ומאומת |
| 4.3 | P1 מודד עץ-עבודה לא index; מקפיץ `wired-floor` בעצמו; TRUTH≡עצמו | HIGH | ✅ §4: `git checkout-index --prefix=$TMP`; הרצפה לא נכתבת ב-hook; `truth` = TRUTH ≡ אורקל (הכרעה C) |
| 4.4 | P5 `git rm --cached` על 49 קבצי-מוצר tracked | HIGH | ✅ **P5 נמחק.** ❓ הכרעה J: `gen_app_*` — מוצר או scratch |
| 4.5 | P6 מכניס `process.env` לאטום (הכרעה 13), שובר Dart/JSON/tests | HIGH | ✅ **P6 = הצעה בלבד** (מדפיס patch, exit 1) |
| 4.6 | P11 חוזה-מהקוד = היפוך חוק-4; ≥100 בתים עובר | MED-HIGH | ✅ **P11 = test-שלד בלבד** (`process.exit(1) // TODO`), רק לאטומים חצובים |
| 4.7 | staging בתוך hook + partial commits ⇒ churn אינסופי | MED | ✅ §4: staging דרך `GIT_INDEX_FILE` (אומת ע"י עדשה 6); partial-staging ב-`new/` ⇒ exit עם הודעה |
| 4.8 | P12 `--fix` עורך קבצים נעולים; `index-add` שורה-2 שגויה | MED | ✅ P12 רק ל-git-config idempotent; P4 רק עם docline `/** */` |
| 4.9 | P3 — שני כותבים לקובץ-מחולל | MED | ✅ **P3 נמחק**; החותמת ב-stats |
| 4.10 | P9 DoD תיאטרון; `session.md` tracked מתנגש | MED | ✅ §4: DoD חייב לנקוב `*.test.mjs` שב-diff וה-hook מריץ אותו; `session.md` = `machtzev/audit/session-<sha6>.md` |
| 4.11 | "פועל לא משתיק" סותר טבלה עם `—` | MED | ✅ לכל פועל שער-שארית `<worker>-fresh` |
| 4.12 | ledger P10 מזין גיזום בנתונים מכובסים | LOW-MED | ✅ 2.4 |

## עדשה 5 · סתירות (14 + 8 חוקים ללא מנגנון)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 5.1 | `exit 2 = צהוב` — `police.mjs:16` הופך הכל לאדום; סותר "ירוקה לפני commit" | HIGH | ✅ §4: `yellow` set ב-`police.mjs` (שלב 0, pins); commit: צהוב לא חוסם אבל מוצהר; push: חוסם בלי ALLOW; CI: אדום |
| 5.2 | skipped=ran; `--inc` 7/21 מול ledger | HIGH | ✅ 2.4; תת-קבוצה-נדרשת לפי `layer` ב-`gates.tsv` |
| 5.3 | §14-A דורס 🔴 21ג בלי מספר-הכרעה | HIGH | ✅ §11: 21ג/T1 גוברים עד הכרעה ממוספרת; `ff-push` + שמירת-ענף כבר עושים push בטוח |
| 5.4 | P1 מעץ-עבודה = L14 | HIGH | ✅ 4.3 |
| 5.5 | ספירות לא מסתכמות (17≠16 · "23 push"≈31 · "3 CI"≠8); `board-single` רפאים | HIGH | ✅ אין סכומים ידניים; המספר מ-`gates.tsv` בלבד |
| 5.6 | stuck-loop — 3 התנהגויות; `.allow_retry` = עקיפה-עצמית | MED | ✅ §8: 2/3 = עצירה + בעלים; אין `.allow_retry` |
| 5.7 | §10 מוריד חובת-קריאה הנעולה לפני הכרעה H | MED | ✅ CLAUDE.md גובר; הכרטיס **בנוסף**, לא במקום, עד H |
| 5.8 | יחידות-מס סותרות (20s/שער · 40s inc · 60s hook) | MED | ✅ §9: יחידה = id; 60s = hook שלם כולל פועלים; inc = 40s ל-7, id>20s ⇒ הזזה |
| 5.9 | `layers` דורש קבצים משלבים 3–6 | MED | ✅ `layers` בודק רק מה ש-`gates.tsv` מצהיר-קיים לשלב |
| 5.10 | הכרעה C ציטטה שגוי — CLAUDE.md:5 מצהיר `atom-index-full.json` מאוחד; V3 מצהיר `atom-index.json` | MED | ✅ §11 C מתוקן: full = 3-שכבות (§21); display = V3; `truth` קורא את שניהם; עד ההכרעה `claudemd-numbers` = מדד |
| 5.11 | P11 test שלא יכול לעבור staged | MED-HIGH | ✅ 4.6 |
| 5.12 | "פועל" = hook וגם סוכן-גל (דיבר-7) | LOW-MED | ✅ §4 נקרא "מנועי-hook"; "סוכן-גל לעולם לא git" |
| 5.13 | "אישור-בעלים" = קובץ שהסוכן כותב | LOW | ✅ 1.6 + גבול כן |
| 5.14 | ids תלויים (`hookspath`, `liveness`, `gates-ledger`, "שלב 5") | LOW | ✅ כל id בשורה אחת בטבעת אחת |
| 5.15 | **חוקים ללא מנגנון:** הכרעה 5/דיבר-10 (דדופ אחרי גל) · הכרעה 12 (עצירת-נחיל) · THE-WAY-6/L46/L28/L40 (קומפילציה+רינדור כשכבת-אימות) · V6 `behavioral/run.mjs` לא ב-gates.tsv · 19א (פטורי-טוהר מוצהרים נספרים) · 20-ד/23-א (אפס-מילון: גידול-wordlist) · דיבר-2 (`goal-anchor` = הסכמה עם השורה, לא נוכחות) · L20 (גל ≤10) | — | ✅ §7 "שערים חסרים": `dedup` (push) · `compile` (CI: `dart analyze` על `new/dart-*` + `behavioral/run`) · `exempt-count` · `wordlist-ratchet` · `goal-anchor` = hash של השורה-המעוגנת · `wave-size` ב-session; ❓ הכרעה 12 = send_later של הבעלים (מחוץ לריפו) |

## עדשה 6 · סביבה ומקביליות (12)
| # | ממצא | חומרה | v3 |
|---|---|---|---|
| 6.1 | **אומת אמפירית (git 2.43):** pre-commit **לא רץ** ב-rebase / `--continue`; ratchet-B מעל ratchet-A נוחת | HIGH | ✅ §3: pre-push משווה כל baseline ל-merge-base עם origin; `post-rewrite` hook מחדש מחוללים; merge-driver לבייסליינים = חיתוך |
| 6.2 | קבצים מחוללים בלי merge-strategy; L-ids רציפים מתנגשים; fingerprints per-clone | HIGH | ✅ §4: `.gitattributes merge=regen`; L-id = `L<תאריך>-<gate>-<sha6>`; retry-ledger tracked |
| 6.3 | `exit 2` לא ניתן-לביטוי; בסביבה זו כל commit ייחסם לנצח | HIGH | ✅ 5.1 |
| 6.4 | session-start: `set -e`+`curl` ראשון; 238MB ב-timeout 60s ⇒ SDK חלקי "מותקן" לנצח | HIGH | ✅ §6: hooksPath שורה 1; `timeout: 600`; התקנה אטומית `.partial`+rename; כשל = צהוב |
| 6.5 | P5 מוחק 49 tracked; `app-ds.mjs:121` מוחק-ומחדש ⇒ 49 מחיקות בכל commit-מחולל | HIGH | ✅ 4.4 |
| 6.6 | P6 שובר `.contract.md` (דוגמאות), Dart, JSON, fixtures | HIGH | ✅ 4.5 |
| 6.7 | `gateDirty` לא-אטומי, ללא lock; kill באמצע = 49 מחיקות | MED | ✅ §7: `GEN_OUT` temp-dir במקום snapshot/restore; `.git/police.lock` |
| 6.8 | timeout 600s נבלע, `ran` מודפס; 7×600s = 70 דק׳ חסימה | MED | ✅ §9: timeout לפי-טבעת (commit 15s/id) = `yellow:timeout`, מוצהר |
| 6.9 | `--inc` ללא מקור-צרכנים; 1000 נתיבים ⇒ דקות | MED | ✅ 1.10 + סף-50 ⇒ מלא מוצהר |
| 6.10 | P1 עץ-עבודה; floor מ-unstaged | MED | ✅ 4.3 |
| 6.11 | scoping fails-open על `HEAD` (detached / unborn) | MED | ✅ 1.2 (תמיד רץ) |
| 6.12 | Linux-only (`pathname`, `/home/user`), `jq` חסר ב-Windows ⇒ pre-tool fails-open; pre-tool חוסם **קריאה** של hooksPath | MED | ✅ `fileURLToPath`; roots מ-env; `jq` חסר ⇒ exit 2; חסימה רק על **כתיבה** של hooksPath |

---

## אימות-עוין (שלי, בבייטים, על הטענות המכריעות)
| טענה | פקודה | תוצאה |
|---|---|---|
| 49 קבצי `gen_app_*` tracked | `git ls-files new/dart-gen-bs new/dart-data-bs/auto \| grep -c gen_app_` | **49** ✓ |
| `police.mjs` הופך כל non-zero לאדום | `grep -n 'catch { fail' police.mjs` | שורות 16, 26 ✓ |
| `contract-check` סף 100 בתים, test = exit 0 בלבד | `sed -n 17,22p` | ✓ |
| `mutation-check` לא רקורסיבי, רק `export const/function/class` | `sed -n 11p;16p` | ✓ |
| regex `--no-verify` מפספס `-n` | `sed -n 94,96p pre-tool.sh` | `(^\|[^a-zA-Z0-9_])--no-verify` ✓ |
| CLAUDE.md:5 מצהיר `atom-index-full` כמאוחד | `sed -n 5p` | ✓ (הכרעה C ב-v2 ציטטה שגוי) |
| `truth --write` כותב `wired-floor` עם `Math.max` | `sed -n 95-99p` | ✓ |
| `typescript` לא מקומי | `ls machtzev/node_modules` | לא קיים ✓ |
| pre-commit לא רץ ב-rebase | עדשה 6 בדקה ב-repo זמני, git 2.43 | ✓ (לא חזרתי; מסומן כעדות-מבקר) |

**מה לא אימתתי בעצמי:** התנהגות `pre-merge-commit`, `GIT_INDEX_FILE` ב-`commit -a`, timeout של SessionStart (60s), `selectVaried` tie-semantics — כולם מעוגנים ב-`file:line` ע"י המבקרים; מסומנים ב-v3 כ-D3 היכן שהם קובעים עיצוב.

## הגבול הכן (THE-LAW IV) — והכרעת-הבעלים 2.9
כל שכבה על-המארח (hooks · pre-tool · pins · ALLOW · stats) ניתנת לעריכה ע"י מי שמריץ אותה. הן מעלות את רצפת-הטעות-הכנה ומיס-הנרציה.
**הבעלים הכריע (F): אין חסימה חיצונית** — הפרוטוקול דינמי, חוקים נוספים מכל באג בלי אישור. לכן ממצאים 1.6 · 3.1 · 3.2 · 3.3 · 5.13 נסגרים **לא** ע"י ruleset/CODEOWNERS/PINS_ROOT אלא ע"י **ראצ׳ט-כיוון + מאמת-עצמאי** (PROTOCOL §5.1): הוספה/החמרה חופשית; החלשה (שער נמחק / הפסיק לירות / baseline גדל / pins התקצרו) מתגלה תוך יום ע"י Routine שמריץ את כלי-המשטרה מ-tag ידוע-טוב על העץ הנוכחי. זה **עד**, לא חומה: סוכן עדיין יכול לכבות את המשטרה ב-commit אחד — והבעלים יידע למחרת. הוכרע ביודעין.

---
---

# 🔴🔴 סבב 2 — red-team של v3 (3.9.2026) · 5 עדשות · 63 ממצאים ⇒ v4

> הפעם התקיפה על המנגנונים ש-v3 הוסיף כתשובה לסבב 1. שלושה מהם נפלו, ושתי עובדות-סביבה שהנחתי היו הפוכות.
> מקרא: ✅ תוקן ב-v4 · 🟡 סיכון-מקובל · ❓ הכרעה · 🧪 אומת אמפירית ב-repo זמני (git 2.43)

## שלושת השברים של v3
1. **המאמת-העצמאי מדד את ה-tag מול עצמו.** 17/21 סקריפטים כובלים את העץ ל-`import.meta.url`; "כלים מ-tag על HEAD" לא ניתן להרצה; ה-selftest של ה-tag מריץ את הסקריפטים של ה-tag; ירוק תמיד ⇒ ה-tag מתקדם לנצח. (עדשה 1)
2. **ALLOW-tracked = deadlock + צ׳ק פתוח.** `machtzev/audit/**` מוגן, וה-ALLOW שמתיר את הכתיבה שוכן בו. וכל לקח דורש `pins-write` (fixture בקובץ נעול) ⇒ ALLOW שגרתי שאיש לא קורא. (עדשות 3, 5)
3. **M5 = הרצת קוד-שרירותי בתוך שכבת-האכיפה.** ובאותה הזדמנות נחשף חור קיים: `contract` מריץ 1,239 בדיקות עם כל הטוקנים של הסשן, בלי sandbox. (עדשה 3)

**שתי עובדות הפוכות:** Dart **קיים** כאן (3.7.2, `boxes` רץ 62/62 ב-31s); `contract` לבדו = **59.6s** — תקציב-ה-commit לא ניתן-להשגה בלי `--files`.

## עדשה 1 · ראצ׳ט-כיוון + מאמת (12)
| # | ממצא | חומרה | v4 |
|---|---|---|---|
| R2-1.1 | tools-from-tag בלתי-ניתן-להרצה: 17/21 סקריפטים = `import.meta.url`; `police.mjs:30` מעביר `HERE+'../new'` | CRITICAL | ✅ `MACHTZEV_ROOT` ב-21 + police (c3); מאמת מריץ `TAG/police.mjs` עם `MACHTZEV_ROOT=H` |
| R2-1.2 | "fixture-של-tag אדום על HEAD" גם הוא tag-on-tag; שער מותנה-נתיב (`if (!argv[2].startsWith('/tmp/')) exit 0`) עובר ונאפה ל-tag הבא | CRITICAL | ✅ רעל-T מוזרק לעותק-H בנתיב האמיתי, סקריפטי-H, `env -i`, בדיוק 1/0; unproven לא-עולה; אין קידום אוטומטי |
| R2-1.3 | tag lightweight, שם צפוי, לא ב-origin; הסוכן יוצר/מזיז/דוחף | HIGH | ✅ SHA מחוץ לריפו; mismatch = tamper; ❓ L tag-protection |
| R2-1.4 | ה-Routine ניתן-לעריכה (`update_trigger`), אין רישום | HIGH | ✅ hash הגדרת-ה-Routine בכל דוח; שקט = אדום |
| R2-1.5 | ה-tag הראשון נושא סקריפטים שבורים ⇒ אדום-כוזב יום 1; צהוב לא מוגדר | HIGH | ✅ tag רק אחרי c1–c4 ירוק-מלא; צהוב ⇒ אין קידום |
| R2-1.6 | רואה רק HEAD פעם ביום; "הקיר" ו-"לא חוסם" באותו מסמך | HIGH | ✅ כיוון פר-commit על `T..H`; `police.yml` עד non-required (❓ M); מילת "קיר" נמחקה |
| R2-1.7 | `baselines ⊆` לא-מוגדר: 3 צורות, 2 כיוונים, rename, שערים כותבים בזמן ריצה | MED-HIGH | ✅ מניפסט `baseline=;dir=` ב-`gates.tsv`; `git show` לא worktree; שערים לא כותבים |
| R2-1.8 | ירוק ⇒ קידום אוטומטי = כל נקודה-עיוורת הופכת baseline | MED-HIGH | ✅ קידום רק עם ack / lag 24h |
| R2-1.9 | `pins ⊆` על שמות = ריק; על hashes = אדום בכל גידול | MED | ✅ נמחק; hash-שונה-בלי-זוג = unproven |
| R2-1.10 | `gates ⊆` על ids; swap-script או `skip=true` בלתי-נראים | MED | ✅ tuples `(id, script, skip)` |
| R2-1.11 | "הודעה לבעלים" בלי ערוץ; קריסה = שקט = ירוק | MED | ✅ ערוץ קבוע; דוח תמיד; שקט = אדום |
| R2-1.12 | DoDs ב-§12 עדיין מצטטים ruleset/PINS_ROOT | LOW | ✅ שוכתבו |

## עדשה 2 · מכניקת-hooks 🧪 (12)
| # | ממצא | חומרה | v4 |
|---|---|---|---|
| R2-2.1 | 🧪 `post-rewrite`+amend רקורסיבי (depth 3+) ומתקן רק tip | HIGH | ✅ מסמן `REGEN_NEEDED`; pre-push freshness לכל commit |
| R2-2.2 | 🧪 `cherry-pick` · `git am` · rebase-picks ⇒ אפס hooks, trailer מועתק | HIGH | ✅ `pre-applypatch`; pre-tool משכתב cherry-pick ל-`--no-commit && commit`; pre-push על הטווח |
| R2-2.3 | 🧪 trailer שורד rebase verbatim; `-F` ⇒ 2 שורות; merge ⇒ "no ledger" | MED-HIGH | ✅ `sha256(tree-id‖ledger)`; דחיית >1; pre-merge-commit כותב ledger; CI = נוכחות |
| R2-2.4 | 🧪 `push :branch` (sha אפסים ⇒ archive קורס) · `--mirror` מוחק/דורס בלי `--force` | MED | ✅ zero-sha/non-ancestor ⇒ 1; `--mirror --prune :ref` חסומים |
| R2-2.5 | 🧪 `git archive` בלי node_modules ⇒ צהוב-תמיד; `export-ignore` מסיר קבצים בשקט | MED | ✅ `worktree add --detach`; `NODE_PATH`; `no-export-ignore` |
| R2-2.6 | 🧪 `merge=regen` נעדר ב-clone טרי ⇒ conflict markers; `union` ממזג RULE/GATE כפולים | MED | ✅ driver ב-self-heal; `no-conflict-markers`; בלי union |
| R2-2.7 | 🧪 `git add` ב-hook נוחת בכל צורה; `commit <paths>` משאיר index ישן ⇒ לולאה חד-צעדית | MED | ✅ `post-commit` מסנכרן |
| R2-2.8 | 🧪 `dart` חסר = `ENOENT status null`; timeout = `ETIMEDOUT`; child שלוכד TERM רץ 3s ומחזיר `status 0` | MED | ✅ סיווג `e.code` קודם; `killSignal SIGKILL` |
| R2-2.9 | 🧪 timeout הורג רק ילד ישיר (נכד `sleep` חי); lock-file תקוע אחרי SIGKILL | MED | ✅ `detached`+kill(-pid); `flock` |
| R2-2.10 | `process.exit(2)` בסקריפט = צהוב לבחירה | MED-LOW | ✅ צהוב חייב `tool=`; כלי-קיים ⇒ אדום |
| R2-2.11 | `GEN_OUT` לא קיים; 13 נתיבים קשיחים; `board-gen:523` פולט import יחסי | MED | ✅ `outDir()` |
| R2-2.12 | `census/atlas` אינו גרף (0 edges); 15 `.mjs` עם `import()` דינמי | MED-LOW | ✅ `import-graph.mjs`; דינמי ⇒ full |

## עדשה 3 · ALLOW · למידה · pre-tool (12)
| # | ממצא | חומרה | v4 |
|---|---|---|---|
| R2-3.1 | ALLOW ב-`audit/**` המוגן = deadlock; "in HEAD" מול "staged" = שני קבצים | MED | ✅ trailer `Allow:` |
| R2-3.2 | כל לקח ⇒ `pins-write` (selftest נעול) ⇒ צ׳ק פתוח | MED | ✅ fixtures ל-`selftest-fixtures/` (לא נעול) |
| R2-3.3 | regex = ליטרל השורה עובר "הוכחה" ומת לנצח | MED | ✅ דחיית regex-escape-של-substring; חייב לפגוע ב-fixture מוזרע |
| R2-3.4 | hunks inline ⇒ סוד ב-LEARNINGS או פטור-secrets; ×3–4 גודל; LEARNINGS לא נעול | HIGH | ✅ `ref: blob:path:lines`; `git show`; LEARNINGS נעול |
| R2-3.5 | M5 מריץ DoD-test = RCE; `contract:21` מריץ 1,239 עם `GH_TOKEN`/`AWS_*` | HIGH | ✅ M5 בלי הרצה; sandbox (§4.3) |
| R2-3.6 | "חצוב" לא ניתן-להכרעה (`מוצא:` = הערה חופשית, 424/1239) | LOW | ✅ M7 נמחק |
| R2-3.7 | trailer = עקביות-עצמית; רק commit-msg כותב; `-n` מדלג גם עליו | MED | ✅ tree-bound, presence-only ב-CI, הראיה = G2 |
| R2-3.8 | "parse חיובי" = tripwire; `bash /tmp/s.sh`, `node -e`, `commit-tree|update-ref`, alias גלובלי עוברים | HIGH | ✅ §6 מוצהר כ-tripwire; הראיה = CI |
| R2-3.9 | self-heal מפעיל hook של התוקף (`checkout -- .githooks`) | MED | ✅ מסומן "נוחות"; פעלי-git על מוגנים נוספו |
| R2-3.10 | 🧪 hooks חלים על תת-סוכנים; `$CLAUDE_PROJECT_DIR` ריק בהם; worktree בלי `.githooks` = אפס hooks | MED | ✅ root מ-`cwd`; `hooks` נכשל אם `.githooks/` נעדר |
| R2-3.11 | `toplevel ≠ project ⇒ 🔒` נועל **את הסשן הזה** (buildsmart ↔ מחצב) | HIGH | ✅ נמחק; hooks פר-ריפו |
| R2-3.12 | deny-list בקובץ הלא-נכון (חלות הגדרות הפרויקט); חסר `pull_request_review_write` (APPROVE מזויף); `gh`/`curl`+token | HIGH | ✅ `mcp__github` כולו; settings במחצב; 🟡 `gh/curl` = חור מוצהר |

## עדשה 4 · צינור-האמת + מדדים (11)
| # | ממצא | חומרה | v4 |
|---|---|---|---|
| R2-4.1 | `atom-census.json` = תת-קבוצה של האינדקס, שדותיו-הייחודיים בלי צרכן (grep = 0) | MED | ✅ נמחק; render-ds+truth קוראים index |
| R2-4.2 | 8 שמות-מחלקה כפולים; ראשון-אלפביתית מנצח; שני הסורקים ממיינים אחרת | HIGH | ✅ exit 1 על כפילות; ❓ K |
| R2-4.3 | ה-32 לא-נגישים בהרכבה גם אחרי רענון; `capability/intent` = צינור נפרד, לא-נמדד | LOW | ✅ TRUTH מצהיר "wired על מסלול app-ds"; שער `generate.mjs`-atoms ⊆ index |
| R2-4.4 | הכרעה I ניתנת-לניפוח ב-spec-stuffing; 21/30 = שמות-תבנית; מתכנסת להגדרה הישנה | HIGH | ✅ קורפוס נעול (pins), בלי תבניות, **לצד** הנגישות |
| R2-4.5 | אין un-ratchet לרצפה; `truth --write` כותב floor; commit משווה ל-HEAD | HIGH | ✅ `--no-floor`; merge-base; `Allow: floor:<n>` |
| R2-4.6 | `measurer:` hash = טאוטולוגיה | MED | ✅ נמחק; רפרנס = tag |
| R2-4.7 | `claudemd-numbers` על 72 טוקנים מספריים | LOW | ✅ truth-block עם markers |
| R2-4.8 | 10 שערים מתעלמים מ-argv ⇒ fixture-זוג לא ניתן-לביטוי | MED | ✅ `MACHTZEV_ROOT` (c3) |
| R2-4.9 | `coverage` live-or-yellow ⇒ צהוב בכל commit ⇒ ALLOW שגרתי | HIGH | ✅ פיצול static/dart |
| R2-4.10 | 100% בלתי-ניתן-להשגה: eligible = 543/1364 | MED | ✅ `wired/eligible` (❓ N) |
| R2-4.11 | `oracle --gate` משווה 3 JSON committed זה-לזה, לא לעץ | HIGH | ✅ הליכה-בזיכרון ב-`oracle --gate`; שער `census` נפרד נמחק |

## עדשה 5 · היתכנות + עקביות (15)
| # | ממצא | חומרה | v4 |
|---|---|---|---|
| R2-5.1 | שלב 0 לא ניתן-להרצה תחת הכללים שהוא מתקין; DoD מצטט ruleset | HIGH | ✅ bootstrap c1–c5 תחת v1 |
| R2-5.2 | "0 yellow בלי maor" — Dart 3.7.2 קיים; `synth` מדלג בשקט; טבלת-תלויות ל-21 | HIGH | ✅ `dart-bin.mjs` משותף; `synth` ⇒ 2; §1 תוקן |
| R2-5.3 | `contract` 59.6s; סקריפטים נעולים מקבלים dir בלבד | HIGH | ✅ `--files` (c3) |
| R2-5.4 | אין גרף-imports; `atlas.mjs` = קטלוג | MED | ✅ `import-graph.mjs` |
| R2-5.5 | צהוב לא חוסם (§3) מול `gates-ledger` חוסם; 4 ערכי-layer ל-3 טבעות | HIGH | ✅ {ran, yellow} ב-commit; domain `commit\|push\|ci` |
| R2-5.6 | 4 שערים כותבים baseline בריצה ⇒ `pins` אדום באותה ריצה | HIGH | ✅ עיקרון 5: שער לא כותב; `baseline-shrink` ב-push |
| R2-5.7 | `floor-advance` ב-pre-push לא יכול לכתוב (archive) | MED | ✅ CI bot-commit |
| R2-5.8 | deadlock §6 ↔ §5.3 (ALLOW/session ב-`audit/**`) | HIGH | ✅ trailer |
| R2-5.9 | PINNED-נגזר בלי regex | MED | ✅ regex ב-§7.3 |
| R2-5.10 | דגל `--index` לא מספיק — כל הנתיבים `import.meta` | MED | ✅ מריצים את העותק |
| R2-5.11 | "parse חיובי" לא-מוגדר לפקודות מורכבות; המודל חוסם קריאה; `one.mjs` מריץ git מתוך node | MED | ✅ tripwire; קריאה מותרת |
| R2-5.12 | 8 ✅ ביומן-סבב-1 בלי מנגנון ב-v3 (1.2 · 1.3 · 1.6/5.13 CODEOWNERS · 1.7 · 2.9 · 5.8 · 5.15 · 6.12) | HIGH | ✅ 1.7 `atom-count` · 2.9 פיצול · 5.15 `Wave:` · 6.12 `MACHTZEV_ROOT`; 1.2/1.3/CODEOWNERS = 🟡 F |
| R2-5.13 | 13 מנגנונים בשם בלבד (ledger, layers, exempt-count, wordlist-ratchet, goal-anchor, liveness, audit_gates…) | MED | 🟡 מפורטים ברמת-שדה בשלבים 1/5/8; מסומנים ב-§7 |
| R2-5.14 | timeouts סותרים (15/20/600; 62×120s) | LOW | ✅ §9 טבלה + סה"כ-טבעת |
| R2-5.15 | סדר-הקריאה = 821 (+398 +294); הכרטיס מוסיף | LOW | ✅ §10 מצהיר |

## מה עדיין פתוח (D3 של סבב 2)
- `permissions.deny` על שם-שרת-MCP — לפי זיכרון-תיעוד, לא מאומת.
- `MACHTZEV_ROOT` ב-21 סקריפטים — c3 הוא הרפקטור הגדול ביותר; לא נמדד.
- הכרעות K · L · M · N.
- **סבב 3** מומלץ אחרי c1–c5, על הקוד ולא על המסמך.
