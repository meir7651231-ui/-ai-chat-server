# PROTOCOL-MAP — מפת הפרוטוקול והשערים של BuildSmart

> **מה זה:** מפה נגזרת, קריאה-בלבד, של כל שכבות-הפרוטוקול בריפו — חוקים · שערים · סוכנים · סקריפטים · מסמכי-ידע.
> **מה זה לא:** מקור-אמת. ה-SSOT לכל פריט רשום לידו. סתירה בין המפה למקור → המקור צודק, והמפה מתעדכנת.
> **נכתב:** 2026-09-02 · מסמכי-המקור נקראו במלואם למעט הרשומים בנספח ג׳ (D3).
> **מיקום:** בשורש הריפו (ליד `CLAUDE.md`). אם יועבר ל-`app_flutter/knowledge/` — חובה שורה ב-`README.md` + verdict ב-`KNOWLEDGE_AUDIT.md` (לקח #59 · T6), אחרת שער 94 / `knowledge_protocol_test` יחסום.

---

## תוכן

| § | נושא | SSOT |
|---|---|---|
| 0 | חוק-על #0 — הנחיל | `CLAUDE.md` · `orchestrator/PLAYBOOK.md` |
| 1 | שני פרויקטים · ענף · מדיניות-push | `CLAUDE.md` · `MASTER_PROTOCOL` א.2–א.3 |
| 2 | ארבע שכבות-אכיפה | `knowledge/PROTOCOL_ENFORCEMENT.md` |
| 3 | pre-commit — המנגנון | `.githooks/pre-commit` (שורות 1–135) |
| 4 | pre-commit — מפת 100 השערים לפי קבוצה | `.githooks/pre-commit` · `knowledge/GATE_REGISTRY.md` |
| 5 | commit-msg · pre-push | `.githooks/commit-msg` · `.githooks/pre-push` |
| 6 | Claude-Code hooks — pre-tool · session-start | `.claude/hooks/*` · `.claude/settings.json` |
| 7 | CI — protocol-enforce (8 שערים) | `.github/workflows/protocol-enforce.yml` |
| 8 | שערים מחוץ ל-hook (117–128 · manifests · central-verify) | `GATE_REGISTRY.md` · `orchestrator/manifests/*` |
| 9 | ערכת האורקסטרייטור (THE-LAW · PLAYBOOK · FACTORY · עדשות · סוכנים · סקריפטים · /swarm) | `orchestrator/` · `.claude/skills/swarm/` |
| 10 | MASTER_PROTOCOL — חלקים א–לז | `knowledge/MASTER_PROTOCOL.md` |
| 11 | סולם-האימות L0–L7a · חקירת-100 · DoD | `knowledge/VERIFICATION_PROTOCOL.md` |
| 12 | תת-פרוטוקולים (השקה · ליטוש · שיפורים · size-filter · אודיט) | `knowledge/*_PROTOCOL.md` |
| 13 | לקחים · מוסכמות · stubs | `CARRY_FORWARD` · `CONVENTIONS` · stubs |
| א׳ | 10 הכללים לכל פעולה (תמצית) | — נגזר |
| ב׳ | מפת חוק → מנגנון-אכיפה | — נגזר |
| ג׳ | D3 — מה לא נקרא · סטיות שנמצאו בין מסמכים | — נגזר |
| ד׳ | פקודות-ריצה | `MASTER_PROTOCOL` לז · `VERIFICATION` §1 |

---

## §0 · חוק-על #0 — נחיל 9×9 לפני כל עבודה

**SSOT:** `CLAUDE.md` (ראש הקובץ) · `orchestrator/PLAYBOOK.md` · `orchestrator/THE-LAW.md`

- **אסור להתחיל שום עבודה** — פיצ׳ר · באג · refactor · תיקון-שורה — בלי להפעיל קודם את הנחיל. אין "משימה קטנה" פטורה.
- **9 תפקידים:** אדריכל · בונה · בודק · מנקה · מבקר · מאמת · מפקח · מייעץ · מדווח.
- **× עדשות:** `orchestrator/lenses/registry.txt`. ⚠️ `CLAUDE.md` אומר "9 עדשות"; הרשומה בפועל מכילה **10** (`text-parity` היא העשירית). ראה נספח ג׳.
- **הזרימה:** מבקרים-לפי-עדשה → מאמת → בונים-לפי-קובץ-דיסיונקטי → מפקח + `orchestrator/scripts/central-verify.sh` (השער).
- **ב-Claude Code רץ flattened:** אורקסטרייטור אחד משגר את כל הצי ישירות; אין קינון-חי (`FACTORY.md` — `NESTING_SUPPORTED=no`, נבדק אמפירית).
- **הפעלה:** `/swarm <task>` (§9.7) או בלוק-ההדבקה ב-`orchestrator/KICKOFF.md`.

---

## §1 · שני פרויקטים · ענף · מדיניות-push

**SSOT:** `CLAUDE.md` · `MASTER_PROTOCOL.md` חלק א

| תיקייה | סטאק | סטטוס | כלל |
|---|---|---|---|
| `app_flutter/` | Flutter 3.29 + Dart 3.7 + Riverpod | 🟢 פעיל לפיתוח | כל פיצ׳ר חדש כאן בלבד |
| `app/` | Preact + TS + Vite + PWA | 🟡 חי בפרודקשן (GitHub Pages) | תיקוני-באג בלבד; string חדש → להעתיק verbatim ל-Flutter |

- **ענף-הפרוטוקול:** `claude/whats-happening-LyY9G` — היחיד שמקבל אכיפה מלאה (ה-hook יוצא בשקט על כל ענף אחר).
- **PUSH POLICY (כלל אבסולוטי):** אין push ללא "תדחוף" מפורש · אין push ל-main ללא אישור-בעלים · אין push בחצי-עבודה (לקח #48) · fast-forward בלבד, לעולם לא force.
- **Preact-shared:** `app/knowledge/`, `app/RULES.md`, `app/src/components/menu|bs`, `app/src/store/*` — לא לגעת אלא אם התבקש מפורשות. שער 68 מקפיא `app/knowledge/inspections`.

---

## §2 · ארבע שכבות-אכיפה

**SSOT:** `knowledge/PROTOCOL_ENFORCEMENT.md` · שער 99 בודק שכל הארבע קיימות

| # | שכבה | קבצים | רץ ב | עוקף מקומית? |
|---|---|---|---|---|
| 1 | Git hooks | `.githooks/pre-commit` · `commit-msg` · `pre-push` | `git commit` / `git push` | ❌ (pre-tool חוסם עקיפה) |
| 2 | Claude-Code hooks | `.claude/hooks/pre-tool.sh` · `session-start.sh` · `.claude/settings.json` | כל Bash/Edit/Write/NotebookEdit · פתיחת session | ❌ |
| 3 | שחזור-אוטומטי | `session-start.sh` → `core.hooksPath=.githooks` + chmod +x + סיכום | פתיחת session (גם מקומי) | — |
| 4 | GitHub Actions | `.github/workflows/protocol-enforce.yml` (job `protocol-gates`) | כל push וכל PR | ✅ חיצוני — לא ניתן לעקוף מקומית; דורש Branch Protection ידני ב-GitHub UI |

**כלל-הזהב של THE-LAW III.5:** רק שכבה 4 (off-host) היא "קיר" אמיתי; שכבות 1–3 מעלות את הרצפה מול טעות-כנה ומיס-נרציה, ואינן גבול-אבטחה (כל שחקן על המארח יכול לערוך אותן).

---

## §3 · pre-commit — המנגנון (לפני השערים)

**SSOT:** `.githooks/pre-commit` שורות 1–135 · 940 שורות סה"כ

1. **Scoping-לענף** — `_PROTO_BRANCHES=("claude/whats-happening-LyY9G")`; ענף אחר → `exit 0` בשקט.
2. **Emergency disable (M4)** — `BUILDSMART_EMERGENCY_DISABLE` חייב להיות זהה לתוכן `.emergency_token`; לבאג קריטי בפרוטוקול בלבד.
3. **P0 (לקח #72)** — `scripts/gen_version.sh` מייצר `lib/version.g.dart` (gitignored) מ-git+STATUS לפני analyze; כשל → שער 11.
4. **מנגנון-למידה: זיהוי retry** — fingerprint של ה-staged נשמר ב-`.git/…` (5 שעות, פורמט `gates=v2:<מספרי-שערים> head=<sha>`); ניסיון-חוזר אחרי כשלון-code/test מפעיל את שער 102.
5. **`err` = חסימה (FAIL++) · `warn` = אזהרה בלבד (WARN++).** רק `err` מפיל commit.
6. **Fail-fast (לקח #68)** — כל השערים הזולים (א–ג) רצים קודם; כשל → עצירה לפני Flutter (~13 דק׳ נחסכות).
7. **Tiered execution (באג #19)** — אין שינוי `.dart/.yaml` staged → מדלג על analyze/test (commit-תיעוד ב-5 שניות).
8. **build web הוצא ל-pre-push** (לקח #72) — לא רץ ב-commit.
9. **שער 100** — סיכום: `FAIL>0 → exit 1` · אחרת "✅ כל 100 השערים עברו".

**ספירה בפועל:** 99 מזהי-שער ייחודיים בקריאות `err/warn` + 6 דינמיים (35–40) + שער-סיכום 100 = ~105 בדיקות; שערים 25/34/59 הוסרו/הועברו; 29–30, 45, 57, 61 — ללא בדיקה ב-hook.

---

## §4 · pre-commit — מפת השערים לפי קבוצה

מקרא: 🛑 = `err` (חוסם) · ⚠️ = `warn` · ⏸ = הוסר/בוטל/הועבר · — = מספר ללא בדיקה

### קבוצה א — יסודות (1–10) · מהיר
| שער | בדיקה | |
|---|---|---|
| 1 | ענף עבודה = ענף-הפרוטוקול | 🛑 |
| 2 | 11 קבצי-ידע קיימים | 🛑 |
| 3 | `WIRING.md` קיים | 🛑 |
| 4 | `pubspec.yaml` קיים | 🛑 |
| 5 | הענף מעוקב ב-origin | ⚠️ |
| 6–7 | `pre-commit` · `pre-push` קיימים בריפו | 🛑 |
| 8–9 | `settings.json` · `pre-tool.sh` קיימים | 🛑 |
| 105 | `commit-msg` קיים (ממוקם בבלוק זה) | 🛑 |
| 10 | workflow של GitHub Actions קיים | 🛑 |

### קבוצה ב — מצב נוכחי (11–20) · מהיר
| שער | בדיקה | |
|---|---|---|
| 11 | `gen_version.sh` הצליח (`version.g.dart`) | 🛑 |
| 12 | גרסה מסונכרנת `version.g.dart` ↔ `STATUS.md` | 🛑 |
| 13 | ROADMAP מכיל "קבוצה א׳" | 🛑 |
| 14 | STATUS מכיל גרסה | 🛑 |
| 15 | `core.hooksPath` מופעל מהריפו | 🛑 |
| 16–17 | `pre-commit` · `pre-push` executable | 🛑 |
| 18–20 | `knowledge/` · `lib/state/` · `test/` קיימים | 🛑 |

### קבוצה ג — תכנון (21–30) · מהיר
| שער | בדיקה | |
|---|---|---|
| 21 | `knowledge/session_plan.md` קיים | 🛑 |
| 22 | session_plan לא ריק / לא template | 🛑 |
| 23 | יש צעד 🟦 (בתהליך) ב-ROADMAP | 🛑 |
| 24 | `WIRING.md` staged כשיש שינוי ב-`lib/` | 🛑 |
| 25 | נעילת-Preact-parity — **הוסר 2026-08-14** באישור-בעלים | ⏸ |
| 26 | שם קובץ-בדיקה `_test.dart` (singular) | 🛑 |
| 27 | שם קובץ snake_case (לא CamelCase) | 🛑 |
| 28 | אין URI מקומי/נתיב-מוחלט בקוד dart | 🛑 |
| 29–30 | — | — |
| 59 | forced version-bump — **בוטל** (לקח #72, היה conflict-magnet) | ⏸ |
| ⇒ | **Fail-fast:** כשל עד כאן → עצירה לפני Flutter | |

### קבוצה ד — בדיקה (31–45) · איטי (3–5 דק׳) · רק אם `.dart/.yaml` השתנו
| שער | בדיקה | |
|---|---|---|
| 31 | `flutter analyze` — 0 errors (warnings לא נספרים) | 🛑 |
| 32 | `flutter test` — כשלים ≤ baseline `known-failing` ב-STATUS; baseline-phantom (מספר ללא שמות ב-`known_failing.txt`) חוסם; כשל pre-existing = ⚠️ | 🛑/⚠️ |
| 33 | מספר הבדיקות לא ירד מהריצה הקודמת | 🛑 |
| 34 | build web — **הועבר ל-pre-push** | ⏸ |
| 35–40 | 6 קבצי-בדיקה חיוניים קיימים: `compat_coverage` · `regression_gate` · `knowledge_protocol` · `smartproduct_contract` · `dedup` · `no_duplicate_specs` (מעבר/כשל מכוסה ע"י 32) | ⚠️ |
| 41 | אין `greaterThan(0)` בבדיקות (שביר על נתונים ריקים) | ⚠️ |
| 42 | helper חדש ב-`lib/logic|data` → יש בדיקה חדשה | 🛑 |
| 43 | `mutation_log.md` קיים | 🛑 |
| 44 | `mutation_log.md` staged כשיש **כל** קובץ staged ב-`lib/logic/` או `lib/data/` (לפי-נתיב, לא לפי-תוכן) | 🛑 |
| 45 | — | — |

### קבוצה ה — איכות קוד (46–60) · מהיר
| שער | בדיקה | |
|---|---|---|
| 46 | אין משטח כהה קשיח (`0xFF111111` וכד׳) | 🛑 |
| 47 | dialog/sheet/route חדש → וודא ב-WIRING | ⚠️ |
| 48 | אין `print()` בקוד production | 🛑 |
| 49 | TODO/FIXME חדש ללא הסבר | ⚠️ |
| 50 | אין `import dart:html` | 🛑 |
| 51 | URL קשיח — שקול config | ⚠️ |
| 52 | אין secret/api_key (ערך, לא רק המילה) | 🛑 |
| 53 | אין קובץ `.env`/סודות ב-staging | 🛑 |
| 54 | אין `ColoredBox` כהה | 🛑 |
| 55 | לוגיקה מקוננת ב-UI — שקול helper | ⚠️ |
| 56 | helper חדש ללא test | 🛑 |
| 57 | — | — |
| 58 | `fromEnvironment` חדש → תעד ב-WIRING | ⚠️ |
| 60 | production dependency חדשה | ⚠️ |

### קבוצה ו — שפה ותרבות (61–75) · מהיר
| שער | בדיקה | |
|---|---|---|
| 61 | — | — |
| 62 | `left/right` קשיח → `start/end` | ⚠️ |
| 63 | `TextAlign.left/right` → `start/end` | ⚠️ |
| 64 | emoji חדש → וודא verbatim מהלגאסי | ⚠️ |
| 65 | `TextDirection.ltr` באפליקציית RTL | ⚠️ |
| 66 | נגעת ב-`app/` (Preact) → העתק verbatim ל-Flutter | ⚠️ |
| 67 | string עברית חדשה ב-`app/` → העתק ל-`app_flutter` | ⚠️ |
| 68 | `app/knowledge/inspections` — קפוא | 🛑 |
| 69 | מחקת צבע → וודא שאינו text-color | ⚠️ |
| 70 | אין הסרת sensitive-pattern מ-`.gitignore` | 🛑 |
| 71 | שינוי cart בלי `cart_bulk_order_test` | ⚠️ |
| 72 | helper לא רשום ב-WIRING | ⚠️ |
| 73 | persistence key לא בפורמט `bs.*.v1` | 🛑 |
| 74 | `ProviderContainer` ידני ב-widget | 🛑 |
| 75 | providers נמחקו | ⚠️ |

### קבוצה ז — בטיחות שמירה ודחיפה (76–90) · מהיר
| שער | בדיקה | |
|---|---|---|
| 76 | commit message לא ריק (נאכף ב-`commit-msg`) | ↗ |
| 77 | קובץ גדול ב-staging | ⚠️ |
| 78 | binary ב-staging | 🛑 |
| 79 | lock/modules ב-staging | ⚠️ |
| 80 | שינוי version ב-`pubspec.lock` — וודא `pub get` | ⚠️ |
| 81 | ה-hook המקומי (`.git/hooks`) שונה מ-`.githooks/` (hash) | 🛑 |
| 82 | `pre-push` מקומי שונה | ⚠️ |
| 83 | `core.hooksPath` ≠ `.githooks` | 🛑 |
| 84 | workflow נמחק | 🛑 |
| 85 | workflow מקולקל (חסר job `protocol-gates`) | 🛑 |
| 86 | SKU כפול בקטלוג | 🛑 |
| 87 | שינוי polyroll בלי `ppr_infra_test` | ⚠️ |
| 88 | שינוי `MASTER_PROTOCOL.md` — וודא הוראה מפורשת | ⚠️ |
| 89 | test נמחק | 🛑 |
| 90 | קובץ state נמחק | 🛑 |

### קבוצה ח — בטיחות סופית (91–100) · מהיר
| שער | בדיקה | |
|---|---|---|
| 91 | שינויים unstaged בקוד — שקול לכלול | ⚠️ |
| 92 | שינוי state בלי עדכון STATUS | ⚠️ |
| 93 | ROADMAP לא עודכן ב-✅ | ⚠️ |
| 94 | `knowledge_protocol_test` עובר (הפניות · README-index · stubs) | 🛑 |
| 95 | מספר עם × בלי LTR-isolate | ⚠️ |
| 96 | `pubspec` version עודכן בלי שינוי קוד | ⚠️ |
| 97 | ניסיון להסתיר `.claude/` ב-gitignore | 🛑 |
| 98 | `settings.json` נמחק מהריפו | 🛑 |
| 99 | פחות מ-4 שכבות-אכיפה | 🛑 |
| 100 | **סיכום** — FAIL>0 → exit 1 | ⇒ |

### קבוצה ט — שכבת למידה (101–105 · 111–112)
| שער | בדיקה | |
|---|---|---|
| 101 | `stuck_log.md` קיים | 🛑 |
| 102 | **retry אחרי כשלון code/test → חייב רשומה חדשה ב-stuck_log** עם `ANTIPATTERN:`/`ANTIPATTERN[hook]:` + `RULE:` (בוקקיפינג-בלבד פטור) | 🛑 |
| 103 | אנטי-פטרנים מ-stuck_log לא חוזרים בקוד החדש; דפוס עם shell-meta מדולג באזהרה | 🛑/⚠️ |
| 104 | stuck_log השתנה → `stuck_regression_test` מתחדש (`generate_stuck_regression.sh`) | ⇒ |
| 111 | מספר `ANTIPATTERN` ב-stuck_log = מספר הבדיקות ב-stuck_regression | 🛑 |
| 112 | stubs מאוחדים (`TESTING`/`CHECKLISTS`/`BUG_INVESTIGATION`/`PROTOCOL`) — שורה 1 = `⛔ DEPRECATED` | 🛑 |

### קבוצה י — לקחי SIZE_FILTER + P2 (106–110 · 113–116)
| שער | בדיקה | |
|---|---|---|
| 106 | session_plan מכיל `Owner:` + `Scope:` (לקחים 23–24) | 🛑 |
| 107 | שינוי `screens/` ללא visual-log | ⚠️ |
| 108 | `CARRY_FORWARD.md` קיים | 🛑 |
| 109 | sub-protocol נסגר בלי לקח ב-CARRY_FORWARD | ⚠️ |
| 110 | audit-log קיים אבל ריק | ⚠️ |
| 113 | crop/render script שונה → תעד visual-verify (contact-sheet) | ⚠️ |
| 114 | `kLipskeyCatalog` אסור ב-`screens/state/logic` → `kCatalogProducts` | 🛑 |
| 115 | hot-file claims — תאם/rebase (advisory) | ⚠️ |
| 116 | שינוי UI (screens/widgets) → `visual_log.md` staged (enforce) | 🛑 |

---

## §5 · commit-msg · pre-push

**`commit-msg`** (`.githooks/commit-msg`):
- הודעה ≥ 15 תווים (ללא שורות `#`) — 🛑.
- חסימת הודעות-זבל: `^(wip|test|asdf|tmp|fix|update|change|123|aaa|xxx|todo)\s*$` — 🛑.
- פורמט conventional commits (`feat|fix|docs|style|refactor|test|build|ci|perf|chore|revert(scope)?:`) — ⚠️ בלבד.

**`pre-push`** (`.githooks/pre-push`):
1. push ל-`main|master|production` ללא `.allow_push_main` — 🛑.
2. remote קדימה (divergence) — 🛑 "השרת קדימה"; פתרון: `git pull --rebase` (או `git fetch && git rebase origin/<branch>`).
3. commit עם הודעה < 25 תווים בטווח הנדחף — 🛑.
4. **רק על ענף-הפרוטוקול:** `gen_version.sh` + `flutter build web --release --no-pub` (2–4 דק׳) — 🛑 בכשל. חירום: `BUILDSMART_SKIP_BUILD=1`.

---

## §6 · Claude-Code hooks

**SSOT:** `.claude/settings.json` (matcher `Bash|Edit|Write|NotebookEdit` → `pre-tool.sh`; `SessionStart` → `session-start.sh`)

### 6.1 `pre-tool.sh` — קבצי-הגנה (PROTECTED_PATHS)
`.githooks/pre-commit` · `.githooks/pre-push` · `.githooks/commit-msg` · `.claude/settings.json` · `.claude/hooks/pre-tool.sh` · `.claude/hooks/session-start.sh` · `.github/workflows/protocol-enforce.yml` · `.git/config` · `.git/hooks/{pre-commit,pre-push,commit-msg}`

### 6.2 וקטורי-עקיפה חסומים
| וקטור | מה נחסם |
|---|---|
| Edit/Write/NotebookEdit על קובץ-הגנה | אלא אם קיים `.allow_protocol_edit` (gitignored) עם תוכן ההוראה; כל עקיפה נרשמת ל-`.git/protocol_audit.log` |
| `--no-verify` | בכל צורה |
| `-c core.hooksPath=` · `git config core.hooksPath ≠ .githooks` | override של hooks |
| `--force` · `--force-with-lease` · `--force-if-includes` · refspec `+branch` | כל force push |
| `rm` · `find -delete` · `mv` · `>` redirect · `cp` (חוץ מ-sync מ-`.githooks`) · `sed -i` על קובץ-הגנה | השמדה/שכתוב |
| aliases מסוכנים · `eval` של `git commit/push` | עקיפה עקיפה |

### 6.3 `session-start.sh`
1. שכבה 3: `core.hooksPath=.githooks` + chmod +x — **בכל סביבה** (תיקון אודיט 2026-06-01).
2. remote בלבד: `flutter pub get` · `gen_version.sh`.
3. על ענף-הפרוטוקול: סיכום — גרסה (מ-STATUS) · ענף · commits ממתינים לדחיפה · צעדים-הבאים (Group A מ-`SMARTPRODUCT_ROADMAP`) · 4 התזכורות הקבועות: 🚫 לא לדחוף ללא "תדחוף" (לקח #48) · 🔒 אסור לעקוף hooks · 🔁 6 כללים (מצא → helper → בדיקה → analyze → test → build) · 🧭 לקח #39 (אבחן 100% לפני פתרון) · 📐 לקח #35 (סשן-פרוטוקול = hook/knowledge/regression בלבד).

---

## §7 · CI — `protocol-enforce.yml` (job `protocol-gates`)

רץ על push + PR. Flutter setup → `pub get` → `gen_version.sh` (לקח #72) → 8 שערים:

| # | שער | מקביל ב-hook |
|---|---|---|
| 1 | Code analysis | 31 |
| 2 | All tests green | 32 |
| 3 | Web build succeeds | pre-push |
| 4 | Versions synced | 12 |
| 5 | No dark surfaces | 46/54 |
| 6 | Hooks not tampered | 81 |
| 7 | Claude settings intact | 98 |
| 8 | Android release build (לקח בנצי — debug מדלג על permission enforcement) | — |

⚠️ `PROTOCOL_ENFORCEMENT.md` מונה "7 שערים קריטיים"; ה-workflow מכיל 8. **Branch Protection חובה ידנית ב-GitHub UI** — בלעדיו שכבה 4 אינה קיר.

---

## §8 · שערים מחוץ ל-hook

### 8.1 שערים-בבדיקות (GATE_REGISTRY — "הבא הפנוי: 129")
| שער | אכיפה | קובץ |
|---|---|---|
| 117 | `lipskey_pdf_parity_test` ירוק — `kLipskeyCatalog` מסונכרן ל-PDF | test |
| 118 | Studio: config ids ⊆ registry | `test/studio/gate_118_test.dart` |
| 119 | Studio: AI-grounded-config | `test/studio/gate_119_test.dart` |
| 120 | Studio: analytics-PII | `test/studio/gate_120_test.dart` |
| 121 | deploy-ordering (`firebase-deploy.yml`) | `functions/src/selftest.ts` (`npm run selftest`, 11 checks) |
| 122 | flags-OFF parity (Pillar-5) | `test/backend_flag_test.dart` |
| 123 | Studio GA safe-by-default (closed-set scan) | `test/studio/gate_123_ga_safety_test.dart` |
| 124 | Fittings-3D safe-by-default | `test/fittings/gate_124_ga_safety_test.dart` |
| 125–127 | שמורים-מראש (intel · authoring · market/privacy) | — |
| 128 | Catalog-config safe-by-default | `test/catalog_config/gate_128_ga_safety_test.dart` |

**פרוטוקול הוספת שער:** בדוק "הבא הפנוי" → שורה בטבלה → עדכן N+1 → הוסף ל-hook עם `# שער N:` → `cp` ל-`.git/hooks` → commit יחד. אחרי rebase: `grep -oE "שער [0-9]+" .githooks/pre-commit | sort | uniq -d`.

### 8.2 `central-verify.sh` — השער של הנחיל (68 שורות)
`pub get` → `gen_version.sh` (אם קיים) → `flutter analyze --no-fatal-infos --no-fatal-warnings` (exit-code + regex) → `flutter test --reporter=compact` → `flutter build web --release` → `--assert <manifest>` (`assert-manifest.sh`) → `--required-tests <manifest>` (`required-tests.sh`). מדפיס fingerprint של היעד (מלכודת scope-targeting של ה-red-team). כל כשל = `GATE FAIL: <שלב>`, exit 1.

### 8.3 Manifests
- `orchestrator/manifests/buildsmart.conformance.txt` — הצהרות-בייטים: `file:::regex` (חובה-נוכח) · `file:::!regex` (חובה-נעדר). דוגמאות: `'הסל שלי'` ב-store_screen · `'מנהל המערכת'` ב-personas · רגרסיה `₪120` / `!₪80` · `o.lines.map` · `!~/ 1000}`.
- `orchestrator/manifests/buildsmart.required-tests.txt` — בדיקות-זרימה-קריטיות שחייבות להתקיים (orders_engine · courier/store stage-advance · acceptance_stage · manager_dashboard_screen · worker_tasks_persistence · stage2 ×4 · stage3_catalog_source_consistency · app_profile_flags). "קיים + suite ירוק" ⇒ "רץ ועבר".
- `orchestrator/schemas/report.schema.json` — חוזה דוח-הריצה (נבדק ע"י `report-lint.sh`).

---

## §9 · ערכת האורקסטרייטור (`orchestrator/`)

### 9.1 THE-LAW — האינווריאנט
- **I. המנגנון (קבוע):** פרקטל (N יחידות, כל אחת מפורקת דרך אותן N → N×N) · צמתים עצמאיים-שלמים (כל צומת "לובש" רק את הפאסט שלו) · artifact משותף, לא זה-את-זה · מקביל.
- **II. הספק (משתנה):** משימת-*being* → ממדים (הסוכן המושלם = 9 → 81) · משימת-*doing* → פאזות (הבנה · תכנון · **עשייה** · אימות · ביקורת · משלוח · חריקה = 7 → 49; רק "עשייה" משנה שם).
- **III. למה טעות לא שורדת (6 שכבות):** (1) בייטים לא פרוזה (2) אימות-האימות — מוטציה: הזרק באג → אדום → שחזר → ירוק (3) השער: analyze 0 + suite + build + conformance + required-tests; skips רועשים (4) היעדר-מבני: auditor ללא Edit לא שובר; fixer ללא shell לא דוחף (5) אכיפה off-host — CI מחזיק את credential-הדיפלוי היחיד (6) הראצ׳ט: כל באג שברח = חוק-רגרסיה קבוע.
- **IV. הגבול הכן:** "אף סוכן לא יטעה לעולם" — בלתי-ניתן-להשגה; הרצפה עולה, זה לא גבול-אבטחה.

### 9.2 PLAYBOOK v2 — הצינור (Orchestrator-Prime)
§0 Onboarding (אל תניח דבר — קרא SSOT, אינווריאנטים, מצב-ריצה) → **0** worktree טרי (`wt-setup.sh`) → **1** Audit fan-out (auditor × עדשה דיסיונקטית, deadline; חסרים → FLAG) → **2** Synthesize (`_findings.md`) → **3** Validate אדברסרי (CONFIRMED / FALSE-POSITIVE / ADJUST / DEFER-LARGE→backlog; חובה כשיש >1 ממצא; `_confirmed.md`) → **4** Fix fan-out (מפת `file→fixer` מפורשת, דיסיונקטי) → **4b** Byte-verify (`grep-verify.sh`; `git diff --name-only` = איחוד-החלוקות, superset = חריגה) → **5** `central-verify.sh` (ירוק = עקביות, לא הוכחת-נכונות; אין "לתקן טסט" אלא אם האסרשן הישן הוכח שגוי) → **6** Docs + version (marker מכונה-קריא) → **7** **Ship — STOP לאישור** (יעד מדויק: branch·sha·diff; ff-push בלבד; divergence → STOP, לא rebase שקט; worktree נמחק רק אחרי push) → **8** Verify deploy (artifact מקומפל, grep ל-marker + string מהתיקון; timeout → DEPLOY-STALLED; לא-נגיש → VERIFY-BLOCKED).

**Hard rules:** קבצים דיסיונקטיים · קרא-לפני-עריכה · בייטים+טסטים > פרוזה (טסט מנצח grep) · שער ירוק לפני כל push · העבר מסקנות לא תמלילים — אבל לעולם לא להשמיט caveat/partial של תת-סוכן · מקור-אמת אחד לכל state · כבד אינווריאנטים · ולידציה אדברסרית חובה · כנות על אופטימיות · פעולות בלתי-הפיכות — אישור בנקודת-הפעולה · תת-סוכנים = עלים (לא משגרים; NEEDS-DECOMPOSITION חוזר למעלה; החזרה ריקה = תקלת-כלי, לא מעבר נקי).
**דוח סופי (צורה חובה):** status (CLEAN/PARTIAL/FAILED) · fixed (count+severity) · DEFERRED · אי-התאמות grep-verify · version old→new · אישור-deploy מהבייטים · ≤2 פסקאות פרוזה.

### 9.3 FACTORY — 3 שכבות · 2 זרימות
Prime → Orchestrators (אחד לתחום) → fleets (auditor/validator/fixer + supervisor אחד לצי). זרימת-פקודה למטה · זרימת-אמת למעלה (supervisor בלבד מדווח, דוח אחד מאוחד). **מודל-ריצה בפועל:** ב-Claude Code — flattened (`NESTING_SUPPORTED=no`); קינון-חי אמיתי דורש Claude Agent SDK.

### 9.4 עדשות (`lenses/registry.txt` — 10)
`cross-role` · `money-numeric` · `edge-crash` · `state-leakage` · `navigation` · `performance` · `accessibility-rtl` · `async-race` · `data-seed` · `text-parity`. `lens-coverage.sh` חוסם אם עדשה נדרשת לא הוחזרה ("9 מ-10 ואף אחד לא שם לב" = חור שקט).

### 9.5 סוכנים (`agents/*.md`)
| סוכן | כלים | תפקיד | גבול |
|---|---|---|---|
| `auditor` | Read Grep Glob Bash | עדשה אחת, קריאה-בלבד, `file:line · defect · severity · fix` + coverage-note | לא עורך, לא בונה |
| `validator` | Read Grep Glob Bash | אדברסרי על הממצאים מול הקוד החי; מסנן false-positives | לא עורך |
| `fixer` | Read Edit Grep Glob | עורך רק את הקבצים שהוקצו לו | לא git/build/test · לא docs/tests · לא WIRING/STATUS |
| `supervisor` | Read Grep Glob Bash | אחד לצי; מאמת אובייקטיבית (שער/grep) ושולח דוח-אמת אחד למעלה | לא עובד, לא מתקן |

### 9.6 סקריפטים (`scripts/`)
| סקריפט | תפקיד |
|---|---|
| `central-verify.sh` | **השער** (§8.2) |
| `assert-manifest.sh` | הצהרות-בייטים conformance+regression מתוך manifest |
| `required-tests.sh` | בדיקות-קריטיות חייבות להתקיים |
| `grep-verify.sh` | אימות בייטים אחרי צי-תיקון (`file:::present` / `file:::!absent`) |
| `lens-coverage.sh` | כל עדשה נדרשת הוחזרה |
| `diff-coverage.sh` | כל קובץ-מקור ששונה מופיע בדוח-הכיסוי (T2 false-green killer: חפיפה-אפס = כשל, לא מעבר) |
| `registry.sh` | רישום כל תת-סוכן; `assert-none-open` חוסם אם נשאר סוכן לא-נאסף |
| `ckpt.sh` | checkpoint עמיד לריצה (ב-git-admin dir, atomic, jq-validated) — resume + סדר-פאזות |
| `report-lint.sh` | דוח "CLEAN" עם deferred/unresolved = כשל |
| `ff-push.sh` | fast-forward בלבד; מסרב לענף-מוגן, ל-divergence, ול-fetch כושל |
| `wt-setup.sh` | worktree detached לריצה |
| `selftest.sh` | בודק כל סקריפט על נתונים סינתטיים; חייב להדפיס `SELFTEST PASS` לפני commit של שינוי-tooling |

### 9.7 `/swarm` (`.claude/skills/swarm/SKILL.md`)
**כלל-הלבישה:** אין system-prompt לכל סוכן → מקדימים לפרומפט את קובץ-הממד שלו (`perfect-agent/dimensions/`): auditor 6+9 · validator 4+6 · fixer 3 · supervisor 6+7 · orchestrator — כל ה-9.
**צינור היררכי:** 1 SENSE (1.1 SSOT→יחידות · 1.2 AUDIT · 1.3 VALIDATE) → 2 ACT (2.1 partition-by-file · 2.2 FIX) → 3 VERIFY (3.1 grep-verify · 3.2 central-verify עם שני ה-manifests · 3.3 mutation-verify · 3.4 SUPERVISE) → 4 SHIP על ירוק בלבד (4.1 commit — ה-pre-commit הוא סט-השערים · 4.2 `ff-push.sh` רק ב"תדחוף" · 4.3 `ckpt` + `registry.sh assert-none-open`).

### 9.8 מסמכי-עיצוב וביקורת-עצמית
- `KICKOFF.md` — בלוק-הדבקה-פעם-אחת (A: `/swarm` · B: פרומפט לכל סוכן).
- `README.md` — מה בערכה · הזמנה-מומלצת (conformance כחלק מהשער) · שכפול · התאמה לסטאק · "מה השערים אינם" · הכלל האחד: בייטים לא פרוזה.
- `SITUATION.md` — הלקח הקשה: המערכת דיאגנזה את החטא ואז ביצעה אותו.
- `HOW-TO-BUILD-IT-RIGHT.md` — תזה: רק שני סוגי-מנגנון מחזיקים (היעדר-מבני · אכיפה off-host); 9 שכבות × (מנגנון #1 · גבול כן); סדר-בנייה.
- `RED-TEAM.md` — red-team של ה-PLAYBOOK: CRITICAL (ff-push לענף-מוגן, scope-targeting) + HIGH — כולם תוקנו/הוקשחו ב-v2.
- `RED-TEAM-OF-DESIGN.md` — "הריצה היא הקיר": 3 חוסמי-runtime מבניים · הזכייה האחת הבנויה-עכשיו · הרצפה הכנה (משולש-מאושר).
- `PERFECT-CODE-FRACTAL.md` — 7×7=49: הבנה · תכנון · כתיבה · אימות · ביקורת · משלוח · חריקה; האלכסון N.N = ליבת כל פאזה; מיפוי לעץ-הסוכנים.
- `design/1-9.md` — 9 ממדי הסוכן המושלם (identity · knowledge · capabilities · reasoning · memory · reliability · communication · autonomy · safety) — **לא נקרא** (333KB, נספח ג׳).

---

## §10 · MASTER_PROTOCOL — חלקים א–לז (חוק-התהליך המאוחד, מוגן בשער 88)

| חלק | תמצית |
|---|---|
| **א** יסודות | למה פרוטוקול · שני פרויקטים · ענף + PUSH POLICY אבסולוטי |
| **ב** כלל R2 | **אין חלון, נקודה** — כל UI הוא dial; תרגום מהפרוטוטייפ; היתרים קיימים לא משנים/לא מוסיפים; R2 לא נתפס ע"י compiler → נאכף ע"י Inspector |
| **ג** לפני שגורעים שורה | שאלת-הפתיחה החובה · 10-step decomposition לכל פעולה |
| **ד** Build Loop | `[1] READ [L#] → [2] PLAN → [3] HELPER טהור+test → [4] TEST → [5] WIDGET+smoke → [6] WIRE+WIRING.md → [7] GATE (checklist ה) → [8] COMMIT (@rule/@legacy/@adr)` — אסור לדלג |
| **ה** Checklist ביקורת | **FND** (data·models·providers) · **FRM** (layout·dial·R1–R5) · **WIR** (state·effects·Riverpod) · **VRB** (verbatim R6/R8 — ההפרה הנפוצה) · **OPS** (analyze+test, תמיד אחרון) |
| **ו** Stuck-Loop P-01 | אותו finding ב-2 מ-3 ביקורות → עצור · `⛔ לולאה-תקועה` · `VERDICT: NO-GO (stuck-loop)` · שאל את הבעלים |
| **ז** דוח ביקורת | `INSP-NNNN` — ממצאים · בדיקת-לולאה · `VERDICT: GO / NO-GO` |
| **ח** Helper-First | תבנית helper טהור + תנאי-גבול + regression gate (`_kRequiredHelpers`) |
| **ט** Verbatim R6/R8 | לפני כל string עברית: חפש `[L#]` בלגאסי → קיים: verbatim + רישום · לא קיים: לא להוסיף (R8) |
| **י** State Machine | טרנזיציות מפורשות; אין state נסתר |
| **יא** WIRING.md | חוזה חי — `wiring_test` + `gaps_test` מאמתים כל שורה |
| **יב** סדר-הבנייה | model → helper → unit test → provider → dial widget → smoke → trigger → WIRING → OPS → commit. **לעולם לא הפוך** |
| **יג** ⛔ הוא ⛔ | חסימה אמיתית → `showInfoSnack('⛔ דורש …')`; אסור toast "בבנייה" שמסתיר חוב |
| **יד** Versioning | `X.Y.Z+N` — major/minor/patch/build-מונוטוני |
| **טו** ADR | `ADR-NNN` — Context/Decision/Rationale/Alternatives/Consequences/Verification |
| **טז** NO STOPPING + Cadence | "חסום" ≠ עצור (עשרות גישות); קיר רק כשבאמת בלתי-עביר. full suite כל ~5 שלבים · commit כל ~20 ops · demo כל ~10 |
| **יז** Git על ענף מהיר | commit קוד בלבד → fetch/rebase → bump בנפרד → analyze+suite → push; `-X theirs` רק כשהחפיפה היחידה היא שורת-גרסה; בהתנגשות-גרסה — הגבוה |
| **יח** Dart/Test pitfalls | `Set == {literal}` = identity · שם test singular · אסור `count > 0` במוטציה · `grep -c` exit 1 על 0 · stale assertions |
| **יט** Engine insights | `plan.items` = BOM לא flow · fitting↔fitting בלי pipe = חסר · drainage ≠ supply · בדוק data-distribution לפני הרחבת-כלל · ΔP בלי side-branches · synthetic specs לא דולפים |
| **כ** Refactor/Deletion | build alongside · בדוק boundaries לפני מחיקת class/widget |
| **כא** Persistence | pattern + test pattern + key migration (`bs.*.v1`) |
| **כב** Flutter-web automation | canvas taps לא אמינים · a11y tree ריק · demo: web server port 8090 |
| **כג** Synthetic catalog | מוצרים סינתטיים מסומנים, לא בקרוסלה |
| **כד** Sub-Agent Patterns | pre-flight לכל batch · fallback chain · 529 clusters · קבצים נפרדים לכל agent |
| **כה** Conventions | theme/colors ("light mode — כל האפליקציה" — ⚠️ ראה נספח ג׳) · RTL · settings sections · commit/branch/version |
| **כו** DECISIONS | D-001…D-013 (light settings · product grid · **D-003 full light-mode** · wire-only-what-has-data · wiring-by-tests · helpers · 100% mutation · knowledge protocol · `_NodeRow` dot · BOM zones · balance valve · BOM zero-new-SKUs · progressive dock) |
| **כז** SCHEMA | 3 עמודות קנוניות |
| **כח** CATALOG-CARD | קבצי-ליבה · dims · `_ProductRow` · siblings · `LipskeyProductSheet` · brand חדש · R8 לכרטיסים |
| **כט** CARD_FLOW | header/diagram · selectors · 📦 נתוני קטלוג · footer · cross-cutting |
| **ל** HELPER_INDEX | טבלה אלפביתית + `_kRequiredHelpers` |
| **לא** STATE_OVERVIEW | מלאי state · Preact-shared ⚠️ · template · persistence keys |
| **לב** TESTS_OVERVIEW | `_test.dart` singular · 10 domains · איפה test ל-helper חדש |
| **לג** PROJECTS_GUIDE | 5 features · id-formula (frozen) · wall-blocked · pattern |
| **לד** SmartProduct handoff | ~46% (32 ✅ + 14 🟦) |
| **לה** BUNDLE_SPLIT | top-10 · cheapest-first · `analyze-size.json` |
| **לו** COACH_MODE | step 99 vision · JIT hints · next-best-action · progressive disclosure · step 100 convergence |
| **לז** פקודות | ראה נספח ד׳ |

---

## §11 · VERIFICATION_PROTOCOL — סולם-האימות

### 11.1 הסולם (בסדר הזה, לפני כל commit)
| # | שכבה | מנגנון | מעבר |
|---|---|---|---|
| L0 | סטטי | `flutter analyze` + `dart format --set-exit-if-changed .` | 0 errors · 0 format |
| L1 | רגרסיה | `flutter test` (129 קבצים, 10 דומיינים) | ירוק · ≤ `known_failing.txt` |
| L1c | חוזה-חיווט | `wiring_test` + `gaps_test` מול `WIRING.md` | כל שורה מכוסה |
| L2 | harness in-app | `runRegression(ref)` (פאנל BS-dial) | כל המודולים |
| L3 | מוטציה | `scripts/mutation_verify.sh` — **לא** `git checkout` | אדום→שחזור→ירוק |
| L3g | stuck→regression | `scripts/generate_stuck_regression.sh` | אנטי-פטרן חדש = טסט חדש |
| L4 | build | `flutter build web --release` + `post_build.sh` | עובר · bundle במגמה |
| L5 | ויזואלי | screenshot before/after | `POLISH_LOG.md` |
| L6 | ידע | verdict + `knowledge_protocol_test` + `protocol_security_test` | ירוק · אין הפניה-שבורה |
| L7 | שרשרת hooks | `commit-msg → pre-commit (100) → pre-push` | הכל |
| L7a | השערים עצמם | `scripts/audit_gates.sh` (מזריק באג לכל שער) | כל שער חוסם |

`protocol_check.sh` = L0–L7 ידני מלא. **L7 חוסם — לא לעקוף;** בעיית-שער → דווח לפרוטוקוליסט (`AGENT_COORDINATION`).

### 11.2 איזו שכבה לאיזה שינוי
UI-presentation: L0·L1·L4·L5·L7 · לוגיקה: L0·L1·L2·**L3**·L4·L7 · state/provider: כמו לוגיקה · microcopy: L0·L1·L7 · knowledge-doc: **L6**·L7. **כל שינוי-לוגיקה חייב L3.**

### 11.3 L3 — 6 צעדי-מוטציה
גיבוי byte-exact → הזרקת תקלה → test אדום → שחזור מהגיבוי → test ירוק → רישום ל-`mutation_log.md` (שער 44 דורש את הרישום).

### 11.4 באג / טסט אדום → חקירת-100-צעדים (§4, מקופל מ-BUG_INVESTIGATION)
לקח #39: **אבחן ב-100% לפני פתרון.** צעדי-אוריינטציה → שחזור → בידוד → השערה → אימות-השערה בבייטים → תיקון-מינימלי → regression → לקח ל-stuck_log/CARRY_FORWARD.

### 11.5 Definition of Done
כל שכבות-§2 ירוקות · לוגיקה: מוטציה נתפסה + regression · UI: before/after ב-POLISH_LOG · ידע: verdict + test · `WIRING.md` עודכן · 100 שערים · **push רק ב"תדחוף"**.

### 11.6 סוכן-ליטוש לפי פאזה
B–G: L0·L1·L4·L5·L7 · H: L0·L1·L7 · I: +L3 אם לוגיקה · **K: L6·L7 — verdict לכל מסמך לפני פעולה.**

---

## §12 · תת-פרוטוקולים

| מסמך | מבנה | עיקר |
|---|---|---|
| `LAUNCH_READINESS_PROTOCOL.md` — סוכן "משיק" | כללי-יסוד · 3 שלבים · deliverables · **100 צעדים**: A אוריינטציה (1–10) · B ארכיטקטורה (11–25) · C ניקיון (26–40) · D בדיקות (41–52) · E ביצועים (53–64) · F נגישות/i18n/RTL (65–74) · G פלטפורמה/חנויות (75–89) · H אבטחה/נתונים (90–94) · I go/no-go + חבילת-הגשה לגוגל (95–100) · סיום-סשן חובה | תוצר = `LAUNCH_READINESS.md` + gap-analysis |
| `POLISH_PROTOCOL.md` — סוכן "ליטוש" | עוגני-אמת במקום טעם · **100 צעדים**: A baseline (1–12) · B layout (13–24) · C צבע/typography/tokens (25–36) · D motion (37–48) · E states (49–58) · F RTL (59–68) · G touch/affordance (69–76) · H microcopy verbatim-guarded (77–84) · I ליטוש-קוד עם בנצי (85–92) · J QA before/after sign-off (93–100) · **פאזה K — ליטוש בסיס-הידע** (K.0 חוק-הברזל: verdict 4-שדות לפני כל merge/deprecate/archive; 76/76 מסמכים ✅ 2026-06-01) | `POLISH_LOG.md` |
| `IMPROVEMENTS_PROTOCOL.md` (סבב 2) | rules of engagement · שיפורים מדורגים · order of attack · action-plan (lane מקבץ/סדרן `lib/screens`) · live log · lessons · דוח Finder v5.62 | |
| `SIZE_FILTER_PROTOCOL.md` | P (בעיות) · S (חוזה מינימלי) · 100 צעדים · live log · closeout · P10 (name-parse + dims fallback) · P9 (inch pretty-fold) · lessons → הולידו שערים 106–110 | |
| `PROTOCOL_AUDIT_PLAN.md` | 100 צעדי-חקירה של הפרוטוקול עצמו: א hook שערים חסרים · ב לוגיקה שגויה · ג CARRY_FORWARD · ד stuck_log · ה session-start · ו regression tests · ז עקביות בין קבצים · ח פערים · ממצאים שתוקנו (2026-06-01 סבבים 1–2) | |
| `PROTOCOL_ENFORCEMENT.md` | 4 שכבות · branch protection · סיכום קבוצות · וקטורי-עקיפה · `.allow_protocol_edit` · תרשים-זרימה · הוספת regression | ⚠️ מונה "105 שערים" · "7 CI gates" (נספח ג׳) |
| `GATE_REGISTRY.md` | מרשם מספרי-שערים (מניעת קולידה, לקח #66/#67) · הבא הפנוי 129 · פרוטוקול הוספה | ⚠️ רשימת "פנויים" סוטה מה-hook (נספח ג׳) |
| `VERIFICATION_PROTOCOL.md` | §11 | |
| stubs ⛔ DEPRECATED (שער 112) | `BUG_INVESTIGATION_PROTOCOL.md` → VERIFICATION §4 · `PROTOCOL.md` → MASTER_PROTOCOL · `TESTING.md` → VERIFICATION · `CHECKLISTS.md` → VERIFICATION §4b · `IMPLEMENTATION_PROTOCOL.md` (Preact) | שורה 1 חייבת `⛔ DEPRECATED` |

---

## §13 · לקחים · מוסכמות

### 13.1 CARRY_FORWARD — Top-10 חובה-לסשן
T1 fetch + branch-check פותח כל סשן (#60) · T2 `scripts/preflight.sh` לפני commit — 30 שניות במקום 13 דק׳ (#68) · T3 re-fetch לפני commit, sessions מקבילים דוחפים (#5) · T4 `kCatalogProducts` לרוחב UI, לעולם לא `kLipskeyCatalog` — שער 114 (#69) · T5 `flutter test <file>` אחרי שינוי טיפוסים — analyze לא תופס import חסר (#70) · T6 קובץ-ידע חדש = שורה ב-README באותו commit (#59) · T7 GATE_REGISTRY לפני הוספת שער (#66) · T8 contact-sheet + עין לפני "done" על assets (#6) · T9 פרוטוקוליסט = hook/docs/tests בלבד, לא feature (#35) · T10 סוכנים מקבילים = קבצים נפרדים בלבד.
**Owner & Scope (23–25):** כל `session_plan` — `Owner: this session` · `Scope: <file:axis>` משפט אחד · `Style: fix → verify → log lesson per step` (שער 106).
לקחים מצוטטים במקומות רבים: **#39** אבחן 100% לפני פתרון · **#48** push רק ב"תדחוף", לא בחצי-עבודה · **#72** version.g.dart מ-git, build ב-pre-push, שער 59 בוטל, P2: 115–116.

### 13.2 CONVENTIONS
Theme/colors (tokens ב-`BsTokens`; ⚠️ הכותרת "light mode" — ראה ג׳) · RTL/עברית (`start/end`, LTR-isolate למספרים) · settings sections · wiring discipline · catalog reads: `kCatalogProducts` (מאוחד) לעומת Lipskey-only · כללי-shell שירשו מ-`app/RULES.md` · commit/branch/version.

### 13.3 קבצי-ידע חיים שהשערים קוראים
`session_plan.md` (21·22·106) · `ROADMAP`/`SMARTPRODUCT_ROADMAP` (13·23·93) · `STATUS.md` (12·14·32·92) · `WIRING.md` (3·24·72) · `mutation_log.md` (43·44) · `stuck_log.md` (101–104·111) · `visual_log.md` (107·116) · `CARRY_FORWARD.md` (108·109) · `known_failing.txt` (32) · `README.md`-index (94).

---

## נספח א׳ · 10 הכללים לכל פעולה (תמצית נגזרת)

1. **נחיל קודם.** אין נגיעה בקוד לפני מבקרים-לפי-עדשה → מאמת → בונים דיסיונקטיים → מפקח + `central-verify.sh`.
2. **ענף אחד.** `claude/whats-happening-LyY9G`. main רק באישור-בעלים.
3. **סדר-הבנייה קבוע.** model → helper טהור → unit test → provider → dial → smoke → trigger → WIRING → OPS → commit. UI לפני helper = באג.
4. **בייטים, לא פרוזה.** grep + test + gate. "done" של סוכן אינו עובדה; טסט מנצח grep.
5. **מוטציה לכל לוגיקה.** אדום → שחזור → ירוק → `mutation_log`. טסט שעובר בשני הכיוונים חסר-ערך.
6. **Verbatim.** string עברית רק עם `[L#]` מהלגאסי; אין — לא מוסיפים. ⛔ הוא ⛔, לא "בבנייה".
7. **הכל דרך ה-hooks.** 100 שערים + commit-msg + pre-push. אסור לעקוף; בעיית-שער → פרוטוקוליסט, לא `--no-verify`.
8. **למידה חובה.** retry אחרי כשל = רשומת `ANTIPATTERN` + `RULE` ב-stuck_log → regression test (שערים 102–104·111). stuck-loop P-01 אחרי 2/3.
9. **תיעוד באותו commit.** WIRING · STATUS · ROADMAP ✅ · visual_log ל-UI · README-index למסמך חדש · CARRY_FORWARD בסגירת sub-protocol · GATE_REGISTRY לשער חדש.
10. **push רק ב"תדחוף".** fast-forward בלבד; divergence → fetch+rebase, לעולם לא force; לא בחצי-עבודה; "live" רק מבייטים של ה-artifact.

---

## נספח ב׳ · מפת חוק → מנגנון-אכיפה

| חוק / עיקרון | מקור | נאכף ע"י |
|---|---|---|
| נחיל 9×9 לפני עבודה | CLAUDE.md #0 | `/swarm` · `lens-coverage.sh` · `registry.sh` — **אין שער-hook שבודק שהנחיל רץ** (משמעת בלבד) |
| ענף-עבודה · לא main | CLAUDE.md · MASTER א.3 | שער 1 · pre-push (`.allow_push_main`) · `ff-push.sh` · pre-tool (force) |
| בייטים לא פרוזה | THE-LAW III.1 · PLAYBOOK | `grep-verify.sh` · `assert-manifest.sh` · supervisor |
| אימות-האימות (מוטציה) | THE-LAW III.2 · VERIFICATION L3 | שערים 43–44 · `mutation_verify.sh` · D-007 |
| השער | THE-LAW III.3 | `central-verify.sh` · שערים 31–33 · CI 1–3 · pre-push build |
| היעדר-מבני | THE-LAW III.4 | `agents/*.md` `tools:` (auditor/validator ללא Edit · fixer ללא Bash) |
| אכיפה off-host | THE-LAW III.5 | CI `protocol-enforce.yml` + Branch Protection |
| הראצ׳ט | THE-LAW III.6 | stuck_log → `stuck_regression_test` (102–104·111) · manifest regression · CARRY_FORWARD (109) |
| R2 — אין חלון | MASTER ב | Inspector (INSP) · שער 47 (dialog/sheet חדש ⚠️) |
| Helper-first | MASTER ח · D-006 | שערים 42·55·56·72 · `_kRequiredHelpers` regression gate |
| Verbatim R6/R8 | MASTER ט | שערים 64·66·67 (⚠️) · manifest conformance · VRB checklist · `text-parity` lens |
| WIRING חוזה חי | MASTER יא · D-005 | שערים 3·24·72 · `wiring_test` · `gaps_test` |
| RTL/עברית | CONVENTIONS · lens `accessibility-rtl` | שערים 62·63·65·95 (כולם ⚠️) |
| dark-mode | CI gate 5 · D-003 | שערים 46·54 (כהה קשיח) — ⚠️ אין שער ל-*light*-קשיח; זה נבדק רק ע"י `tools/atom/decompose/bin/colors.dart` (atlas) |
| Preact-shared קפוא | CLAUDE.md | שער 68 · (25 הוסר) |
| סודות | שערים 52·53·70·97 | + `run_secret_scanning` ב-CI (לא בריפו) |
| הגנת-הפרוטוקול-על-עצמו | PROTOCOL_ENFORCEMENT | שערים 6–10·15–17·81–85·97–99 · pre-tool PROTECTED_PATHS · CI 6–7 · `audit_gates.sh` (L7a) · `selftest.sh` |
| ידע מאונדקס · stubs | POLISH K · לקח #59 | שער 94 (`knowledge_protocol_test`) · 112 · `KNOWLEDGE_AUDIT` verdict |
| Owner/Scope/session_plan | CARRY_FORWARD 23–25 | שערים 21·22·106 |
| visual verify ל-UI | לקח #72 P2 · T8 | שערים 107 (⚠️) · 116 (🛑) · 113 |
| push רק ב"תדחוף" | לקח #48 · session-start | **אין מנגנון טכני** — pre-push חוסם main/force/divergence בלבד; ההרשאה היא הבעלים |

---

## נספח ג׳ · D3 — מה לא נקרא · סטיות בין מסמכים

### לא נקרא / נקרא-חלקית
- `orchestrator/design/1-identity.md … 9-safety.md` (333KB) — 9 ממדי הסוכן-המושלם. לא נקרא.
- `app_flutter/knowledge/CATALOG-CARD-PROTOCOL.md` (1143 שורות) · `STATUS.md` (1557 שורות, v7.02, known-failing: 0) — מבנה-כותרות בלבד.
- `scripts/audit_gates.sh` · `scripts/generate_stuck_regression.sh` · `scripts/preflight.sh` · `scripts/protocol_check.sh` · `scripts/mutation_verify.sh` — לא נקראו במלואם (מוזכרים דרך VERIFICATION/CARRY_FORWARD).
- `perfect-agent/` (הממדים ש-`/swarm` מלביש) · `CURRICULUM-RAW.md` — לא נקראו.
- שערים 103/104/116 — קריאת-הקוד המלאה של הבלוקים נעשתה בסשן קודם; במפה זו התיאור מבוסס על הכותרות + קריאות err/warn.

### סטיות שנמצאו (המקור-הקשיח = ה-hook / ה-workflow / הרשומה בפועל)
| # | מסמך | אומר | בפועל |
|---|---|---|---|
| 1 | `CLAUDE.md` #0 | "9 עדשות" | `lenses/registry.txt` = **10** (`text-parity`) |
| 2 | `PROTOCOL_ENFORCEMENT.md` | "pre-commit — 105 שערים" · שכבה 4 "7 השערים הקריטיים" · קבוצה ט "101-105" | 99 ייחודיים + 6 דינמיים (≈105 ✓) · CI = **8** · קבוצה ט כוללת גם 111–112, וקבוצה י 106–110·113–116 |
| 3 | `GATE_REGISTRY.md` "שערים פנויים" | 6–9 · 11 · 16–23 · 26–30 · 43–45 · 55–57 · 66 · 71–73 · 77 · 79 · 82 · 84–87 · 105 פנויים | ה-hook **משתמש** ב-6·7·8·9·11·16–23·26–28·43·44·55·56·66·71·72·73·77·79·82·84·85·86·87·105. פנויים באמת: 29·30·45·57·61 (+25·34·59 מבוטלים) |
| 4 | `GATE_REGISTRY.md` טבלה | 33 = "build web builds clean" · 34 = "known_failing ידני" · 36–40 = tokens/providers/state/screens/WIRING | ב-hook: 33 = מספר-בדיקות לא ירד · 34 = הועבר ל-pre-push · 35–40 = 6 קבצי-בדיקה חיוניים |
| 5 | `GATE_REGISTRY.md` קבוצות | א׳ 1–20 · ב׳ 25–80 · ג׳ 81–100 · ד׳ 101–114 | ה-hook: 10 קבוצות א–י כמפורט ב-§4 |
| 6 | `MASTER_PROTOCOL` כה · `CONVENTIONS` · D-003 | "light mode — כל האפליקציה" | קיים `AppTheme.dark()`, CI gate 5 "No dark surfaces", ו-atlas dark-mode (652 משטחים הומרו, 2026-09) — המסמכים לא עודכנו למצב dual-theme |
| 7 | `session-start.sh` | מפנה ל-`BUG_INVESTIGATION_PROTOCOL.md` (100 צעדים) | הקובץ הוא stub ⛔; התוכן ב-`VERIFICATION_PROTOCOL.md` §4 |
| 8 | `central-verify.sh` | `--no-fatal-warnings` (warnings לא מפילים) | עקבי עם שער 31 (errors בלבד) — לא סטייה, אך L0 בסולם דורש גם `dart format`, שאף שער לא מריץ |
| 9 | `PROTOCOL_ENFORCEMENT` וקטורים | "Edit/Write על `.githooks/`" | pre-tool מגן גם על `session-start.sh` · `protocol-enforce.yml` · `.git/hooks/*` (רחב יותר מהמתועד) |

### פערי-אכיפה מבניים (לא באגים — הערות-מפה)
- **חוק-על #0 (הנחיל) ו-"תדחוף"** — שני החוקים החשובים ביותר אינם נאכפים ע"י שום שער; הם משמעת בלבד.
- **light-קשיח בדארק** — שערים 46/54 תופסים רק *כהה*-קשיח; ההפך (לבן-קשיח שמפריע ל-dark) נבדק רק ע"י ה-atlas ידנית. 1,537 אתרי-ink קשיחים (`inkLight`/`mutedLight`) פתוחים — גל-נגישות ממתין להוראה.
- **גל-נגישות** — עדשה `accessibility-rtl` קיימת; אין שער-hook לניגודיות.

---

## נספח ד׳ · פקודות-ריצה

```bash
export PATH="/home/user/flutter/bin:$PATH"

# פתיחת סשן (T1)
git fetch origin claude/whats-happening-LyY9G && git rev-parse HEAD

# OPS לפני commit (חלק לז · L0–L4)
cd app_flutter && flutter analyze && flutter test && flutter build web --release

# preflight — שערים 81/83 + גרסאות, בלי Flutter (T2, 30 שניות)
bash app_flutter/scripts/preflight.sh

# הריצה המלאה L0–L7 ידנית
bash app_flutter/scripts/protocol_check.sh

# מוטציה (L3) — לא git checkout
bash app_flutter/scripts/mutation_verify.sh <file> <test>

# stuck_log → regression (L3g)
bash app_flutter/scripts/generate_stuck_regression.sh

# אודיט השערים עצמם (L7a)
bash app_flutter/scripts/audit_gates.sh

# השער של הנחיל (מהשורש)
orchestrator/scripts/central-verify.sh app_flutter \
  --assert orchestrator/manifests/buildsmart.conformance.txt \
  --required-tests orchestrator/manifests/buildsmart.required-tests.txt

# self-test של ערכת-הסקריפטים (לפני commit של שינוי-tooling)
orchestrator/scripts/selftest.sh

# atlas dark-mode (מהשורש בלבד)
dart run tools/atom/decompose/bin/colors.dart --batch app_flutter/lib

# קולידת-שערים אחרי rebase
grep -oE "שער [0-9]+" .githooks/pre-commit | sort | uniq -d

# commit — תמיד ברקע (ה-hook רץ 3–5 דק׳ כשיש dart) · push רק ב"תדחוף"
git commit -m "feat(scope): ..."    # לעולם לא --no-verify
git fetch && git rebase origin/claude/whats-happening-LyY9G && git push -u origin claude/whats-happening-LyY9G
```
