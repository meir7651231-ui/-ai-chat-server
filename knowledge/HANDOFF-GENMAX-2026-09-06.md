# מסירת-המחולל (GENMAX) לסשן הבא — 6.9.2026

> נקודת-כניסה יחידה לסשן חדש. הכל דחוף ונקי על `claude/hei-rxv1v1` בשלושת הריפואים. אין push ל-main בלי אישור-בעלים.

## 0 · מצב למסירה (אמת מהשערים, לא מהזיכרון)
analyze 0 · 156/156 (17 קבצי `genesis_*`) · gen-verify **74/111 · 52 אטומי-תצוגה** (DS+forge) · 3/3 אפליקציות בעור-forge מוצהר · 359 אטומי-forge · 26 תפקידי-עור · 19 מודולים · 16 ישויות · המשטרה המלאה ירוקה ב-pre-push · 4 אתרי-דמו ב-gh-pages ≡ הבנייה המקומית (sha).
**נשאר אצל הבעלים בלבד (G16):** מגמת-KPI (דורשת היסטוריה) · policy-config של הגרעין (שבת/כשרות/הרשאות).

## 1 · הריפואים
| ריפו | תפקיד | ענף |
|---|---|---|
| `meir7651231-ui/-ai-chat-server` (גנסיס) | המנועים · Pure · forge · הידע | `claude/hei-rxv1v1` |
| `meir7651231-ui/buildsmart` | המראה (`app_flutter/lib/genesis/`) · הבנייה · gh-pages | `claude/hei-rxv1v1` |
| `meir7651231-ui/maor-system` | TERM_DEFS (המונחים ⇒ `entity-terms.data.json`) | `claude/hei-rxv1v1` |

## 2 · המנועים — בסדר הריצה של `ship`
1. `machtzev/ds-forge.mjs` — Pure HTML (`machtzev/pure/<family>-family.html`) ⇒ `new/dart-forge-bs/` + `forge-manifest.json`. 8 תפרים נגזרי-DOM: fields · items[+תאים·columns·variants] · values · control · onAction · child · bare. **אסור לערוך `dart-forge-bs` ביד** — תיקון = ב-Pure/במנוע ⇒ regen.
2. `machtzev/generator/auto-skin.mjs` ⇒ `auto-skin.json` — **בורר-אטום-לפי-ייעוד** (הכרעה-25): לכל תפקיד-עור המנוע מדרג את כל אטומי-forge לפי אותות-צורה; `skin` בספק = דריסה בלבד. אחריו `tighten-types.mjs --record --apply` (G20: הידוק-טיפוסים לאטומים שכבר הומרו; פנקס `tighten-applied.json` · דחיות `tighten-rejected.json`). **מנוע-ההמרה עצמו:** `machtzev/emit/ast-js-to-dart.mjs` — מ-G20 פולט חתימות מוקלדות (הסקה סטטית + `--types` מראיית-בדיקות); ⚠️ הנתיב `-ai-chat-server` מתחיל במקף — תמיד `./` (L88) ⇒ `auto-logic.mjs` ⇒ `auto-logic.json` — **בורר-מנוע-לוגיקה-לפי-ייעוד** (G18): 30 פעולות × 848 מנועים; החלפה מיושמת רק אחרי הוכחה בבדיקות-הזהב (`--prove`); מועמד לא-≡ מקבל עטיפת-חתימה מהמקור (G19) + מוטציית-רגישות לפני ההוכחה. אחריו `skin-golden.mjs` — 9 מודולי-SchoolOS בעור-forge (`gen_schoolos_*_forge.dart`). הזהב (`schoolos*.dart`) לא נגע (חוק-7).
3. `machtzev/generator/core-from-shape.mjs` ⇒ `core-registry.json` · `core-dart.mjs` ⇒ `gen_core_<entity>.dart`.
4. `machtzev/generator/sentence.mjs` — משפט-בעברית ⇒ ישות (TERM_DEFS + `aliases` מהספק; נושא לפני מילת-יחס) ⇒ מודול-זהב מוסב (`retarget.mjs`) ⇒ `gen_retarget_<entity>_from_<tag>[_sk<tag>].dart`.
5. `machtzev/generator/retarget.mjs` — הסבה + `skinPass` (26 תפקידי-עור, שורות-צ׳יפים דרך helpers, טבלה/גרפים/לוח/קנבן).
6. `machtzev/generator/app-from-sentences.mjs` — `app-golden*.json` ({name, goal, modules:[{sentence, goal, ops}] | sentences[], aliases, skin=דריסה}) ⇒ `gen_app_<name>.dart` + מודולים + בדיקה מחוללת; מנקה יתומי-`_sk*`. **G17c:** `ops` = שמות-חלקיקים (`PARTICLE_NAMES`) ⇒ הרכבה-מינימלית של החלקיקים האלה (`_p<hash>`).
7. `machtzev/generator/gen-verify.mjs` — כל `gen_*.dart` נטען ב-flutter test מחולל; ראצ׳ט רק-עולה (`gen-verify-baseline.json`).
8. **`machtzev/generator/ship.mjs`** — הפקודה האחת.

```bash
# regen ⇒ מראה ⇒ analyze ⇒ test ⇒ שערים ⇒ אינדקס+אמת ⇒ build ⇒ צילום ⇒ gh-pages ⇒ commit×2 (Allow אוטומטי) ⇒ push×2
SESSION_URL=<url-של-הסשן> node machtzev/generator/ship.mjs --msg "גל … (מנוע · הכרעה-24 · L<n>)" --lesson L<n>
#   --no-build --no-deploy   כשהאתרים לא השתנו · --no-commit לאימות בלבד · --full-verify
```

## 3 · הוספת יכולת — הדרך
- **אטום חסר / וריאנט חסר** ⇒ תא חדש ב-`machtzev/pure/<family>-family.html` ⇒ `ship` (ds-forge חוצב, auto-skin מדרג; אם האטום החדש הכי-טוב לתפקיד — הוא ייבחר לבד).
- **מונח/ישות חדשים** ⇒ `TERM_DEFS` במאור (`src/types/features.ts` + `sections.ts` + `termFallbacks`) ⇒ `node machtzev/generator/entity-terms.mjs` ⇒ משפט-זהב ב-`sentence-golden.json`. הכרעת-דומיין = `aliases` בספק, לא קוד-מנוע (§20-ד, L79).
- **אפליקציה חדשה** ⇒ `app-golden-<n>.json`: `goal` + `modules[{sentence, goal, ops}]` (אדם כותב צעדים 1–2; `ops` מהקטלוג — שגיאה מונה את הזמינות) ⇒ `ship`. העור נבחר לבד (הכרעה-25).
- **שער חדש** ⇒ שורה ב-`machtzev/gates.tsv` **וגם** שורה ב-`ship.regen` באותו commit (L80).

## 4 · מלכודות שנקנו ביוקר (קרא לפני שנוגעים)
- `flutter` תמיד עם `cd /home/user/buildsmart/app_flutter` מפורש — "0 errors" מזויף ב-cwd שגוי (L74).
- אין לגעת במראה בזמן ש-`ship` דוחף (pre-push מאמת סחף-מראה).
- טיוטות-M4 ריקות ב-`LEARNINGS.md` חוסמות commit: ממלאים (ref+regex+RULE+fixture) או, אם נולדו מכשל-מטא (learn), מוחקים ומסמנים `resolved` ב-`audit/retry.jsonl` (L81).
- קבצים נעולים (CLAUDE.md, LEARNINGS.md, שוטרים, hooks) — `ship` מוסיף `Allow: pins-write:` לבד; ביד: `node machtzev/pins-check.mjs --write` + trailer.
- §20-ג: שקע בלי ערך-אמת ⇒ מסתירים, לא ממציאים (אין חץ-מגמה בלי היסטוריה).

## 5 · מה לקרוא, בסדר
`CLAUDE.md` → `machtzev/VERIFY-LAWS.md` → `LAW.md` → `knowledge/HOWTO-GENERATOR-2026-09-04.md` → `knowledge/PLAN-GENERATOR-MAX-2026-09-04.md` §7 → `knowledge/CLOSED-GENMAX-G13-2026-09-05.md` (§G13a–G15b) → `machtzev/LEARNINGS.md` L51–L82.

## 6 · אתרי-הדמו
https://meir7651231-ui.github.io/buildsmart/schoolos/ · `/studio/` · `/kehila/` · `/tzedaka/` (נשמרים ע"י `deploy.yml` של buildsmart; האתר-החי לא מושפע). ראיות: `machtzev/audit/goals/gen_app_{studentsforge,kehila,tzedaka}_web.png`.
