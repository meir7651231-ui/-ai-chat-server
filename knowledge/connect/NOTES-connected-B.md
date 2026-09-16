# NOTES — connected-B (חצי ב׳ · 29 מנועים מחוברים)

## מה נבדק בצעד-0 (פקודות, לא טענות)

```
git rev-parse HEAD                                    ⇒ 60ad1b725c4399ff8d703612dd4af35f8b83e205
npm ci --prefix machtzev                              ⇒ added 1 package, 0 vulnerabilities
git fetch --depth=1000 origin claude/mizug            ⇒ ok
node machtzev/census/engine-index.mjs --connected      ⇒ מחוברים 57 · לא-מחוברים 285 · (מתוך 342 בריפו)
                                                         שערים 57 · בשתי הקבוצות 21
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' | sort > /tmp/nc.txt   ⇒ 285 שורות
grep -cxFf /tmp/my.txt /tmp/nc.txt                     ⇒ 0        (כל 29 שלי **מחוץ** ללא-מחוברים)
wc -l <29 הקבצים>                                      ⇒ 7,531 שורות (הפרומפט אמר ~7,560)
```

הגדרת «מחובר» נקראה מהקוד: `machtzev/census/engine-index.mjs:310-334` — ייבוא טרנזיטיבי
מאחת מ-6 נקודות-הכניסה `GEN_ENTRY` (`app-ds` · `regen` · `ship` · `genesis-gen` ·
`app-from-sentences` · `balagan`) **או** הרצה-בשם מתוך טקסט `regen.mjs`/`ship.mjs`.
שערי-משטרה אינם נחשבים מחוברים (‏`engine-index.mjs:315-316`).

## סדר-הצינור כפי שהוא נקרא מהקוד (לא מפרוזה)

מקור-הסדר: `machtzev/generator/regen.mjs:6-29` (‏`REGEN`) ו-`:30-37` (‏`INDEX`),
ו-`machtzev/generator/ship.mjs:38-77` שמריץ אותם.

```
                    ┌──────────────────────── ship.mjs (CLI · נקודת-כניסה, אפס-ייצואים)
                    │  ship:38  runRegen(REGEN)
                    │  ship:42  mirror ⇒ buildsmart/lib/genesis
                    │  ship:62  flutter analyze (0 errors)
                    │  ship:66  flutter test genesis_*
                    │  ship:72  שערים: retarget · skingolden · appgen
                    │  ship:77  runRegen(INDEX)
                    │  ship:79  flutter build web × SITES(7)  ⇒ site-shot ⇒ gh-pages
                    │  ship:115 pins --write ⇒ commit+push (buildsmart ואז גנסיס)
                    └──────────────────────────────────────────────────────────────

REGEN (regen.mjs:6-29), משמאל-לימין = סדר-הריצה:
  ds-forge ──────────────► new/dart-forge-bs/*  +  forge-manifest.json
     │                         │
     │                         ▼
     │                    auto-skin ──► auto-skin.json      (תפקיד-עור ⇒ אטום-forge)
     ▼
  tighten-types (--record --apply) ──► חתימות-Dart מהודקות ב-new/dart-maor
     │
     ▼
  logic-census ──► logic-census.json ──┐
                                        ├──► oracle --write ──► atom-index-full.json
  atom-index (ב-INDEX) ──► atom-index.json ┘                       │
     │                                                             ▼
     │                                                        auto-logic
     ▼
  skin-golden ──► gen_schoolos_*_forge.dart      (משתמש ב-render-module + retarget.skinPass
     │                                            + resolveSkin/autoSkin של app-from-sentences)
     ▼
  core-from-shape ──► core-registry.json ──► core-dart ──► gen_core_<entity>.dart
     │
     ▼
  app-from-sentences ──► gen_app_<name>.dart + gen_main_<name>.dart + gen_retarget_*.dart
     │      ▲                                   + <buildsmart>/test/genesis_gen_app_*_test.dart
     │      └── sentence.fromSentence ──► sentence.resolve (מונחים) ──► retarget.pickModule
     │                                                              ──► retarget (ישות ⇒ קוד)
     │                                                                    ▲
     │                                                                    └── render-module
     ▼
  behavior-plan ──► behavior-compose ──► gen_behaviors.dart (bh*)
     │                   ▲
     │                   └── logic-proof (מריץ דוגמאות ב-Dart על כל מועמד)
     ▼
  peruk --all ──► specs-ds/*.txt ──► app-ds פר-ספק (dsSpecs()) ──► render-ds ──► מסכים
     │                                    ▲
     │                                    └── tzinor.specFromSentence  (ראשי)
     │                                    └── nl-spec.nlToSpec         (נפילה-לאחור)
     ▼
  balagan ──► אפליקציה אחת ──► server (רק אם הספק מצהיר `שרת: ענן`)

INDEX (regen.mjs:30-37): logic-census ⇒ atom-index ⇒ oracle ⇒ quarry-golden ⇒ op-census ⇒ truth --write
```

## החלטות שלקחתי (בלי לשאול)

1. **המדד ל«יכולת» = מה שהקוד עושה, בפועל, עם `file:line`.** לא כותרת-הקובץ ולא
   `engine-index.json`. השתמשתי ב-`engine-index` רק כדי לדעת **מי מייבא את מי** (שדה
   `importedBy`, שנגזר מסריקה) — וכל טענת-יכולת אומתה בקריאת הקוד.
2. **`quality.measured` מקבל «כן» רק אם הרצתי את הפקודה בסשן הזה** והפלט מצוטט
   ב-`evidence`. שער שקיים אך לא הרצתי (כי הוא כותב לעץ, בונה Flutter, או דורש
   buildsmart) מסומן במפורש «כן, אך לא הורץ כאן» עם הסיבה. אין שער ⇒ «לא-נמדד».
3. **לא הרצתי שום פקודה שכותבת לעץ** (‏`--write` אסור; `regen`/`one`/`ship` כותבים).
   השערים שהרצתי הם לקריאה-בלבד ומסתיימים ב-`process.exit(0/1)`.
4. `/tmp/nc.txt` ו-`/tmp/my.txt` נשמרו ב-`/tmp` כפי שהפרומפט ביקש מפורשות.
5. `regen.mjs` ו-`one.mjs` נקראו **לעיון בלבד** (סדר-הצינור) ואינם מדווחים — הם אצל העובד השני.

## הפקודות שהורצו לאיסוף-עדות (13 שערים · כולן קריאה-בלבד; `git status --short` נשאר ריק)

```
node machtzev/generator/sentence.mjs --gate        ⇒ ✓ 16/16 משפטי-זהב (27 מונחי-ישות · אפס-LLM)
node machtzev/generator/tzinor.mjs --gate          ⇒ ✓ 43 מילות-ישות · 22 לשדות-אמת (465 שדות עם src) · 21 פתוחות · 6 רב-מועמדים · 0 המצאות
node machtzev/generator/retarget.mjs --gate        ⇒ ✓ 8 מודולים-לישות-אחרת ≡ דטרמיניסטי · בורר-מודול 49 ישויות (חזק 25 · בינוני 19 · חלש 5)
node machtzev/generator/render-module.mjs --gate   ⇒ ✓ --all ≡ מקור 9/9 (ביט-לביט) · 9 מודולי-משנה + 2 הרכבות-חוצות-מודולים
node machtzev/generator/auto-skin.mjs --gate       ⇒ ✓ 27 תפקידים נבחרו מבנית מ-359 אטומים · toneMap 3
node machtzev/generator/skin-golden.mjs --gate     ⇒ ✓ 9/9 מודולי-SchoolOS בעור-forge ≡ מחולל-טרי
node machtzev/generator/cover.mjs --gate           ⇒ ✓ שחזור-ATOM top-1 18/58 · top-3 29/58 (רצפה 18/29)
node machtzev/generator/core-from-shape.mjs --gate ⇒ ✓ 49 ישויות · יחסים 32/33 · workflows 8 (2 עם אטום-מעבר · 6 סדר-הצהרה) · אירועים 35 · חוקים 383 · ערוצים 14
node machtzev/compose-engine.mjs --gate            ⇒ ✓ 60 חלקיקים ≡ הדוח · 0 מזייפים חסומים
node machtzev/census/oracle.mjs --gate             ⇒ ✓ 1887 = תצוגה 924 + לוגיקה 963 (אפס-איבוד) · אינדקס ≡ עץ-חי · כפילויות-מחלקה 8
node machtzev/generator/tighten-types.mjs --gate   ⇒ ✓ 228 אטומי-dynamic · ראיה ≡ טרייה · 0 חתימות שניתן להדק ונותרו dynamic
node machtzev/pins-check.mjs                       ⇒ ✓ 139 קבצים חתומים ותואמים (sha256 מלא · רשימה נגזרת ≡ כתובה)
node machtzev/truth.mjs --gate                     ⇒ ✓ TRUTH.md ≡ מדידה · חיווט 108/1887 ≥ רצפה 53
node yeshiva/gate.mjs --gate                       ⇒ ✓ 28 פירוקים · 333 ממצאים · 286 פסק המנוע לבד · 47 מתגים (רצפה 286/47)
```

מדידות-פלט עצמאיות (‏`node -e`, לא שער):

```
new/dart-forge-bs/forge-manifest.json   ⇒ total=359 · families=17 · uniqueNames=305 · renamed=54
                                           תפרים: child 359 · items 163 · actions>0 93 · bare 34 · control 23 · values 20 · columns 6 · states 5
machtzev/generator/logic-census.json    ⇒ total=963 · wireable=120 · {dart-maor 569 · dart 289 · dart-boxes 105}
machtzev/generator/atom-index-full.json ⇒ full=1887 · display=924 · logic=963
ls machtzev/pure/*.html | wc -l         ⇒ 21   (מקור-האמת של ds-forge)
```

## ממצאים שכדאי להחזיק בראש כשמשווים מחובר מול לא-מחובר

- **`nl-spec` אינו המסלול-הראשי יותר.** `app-ds.mjs:70-71` מריץ קודם
  `tzinor.specFromSentence`, ורק אם הספק יצא ריק נופל ל-`nlToSpec`. ההבדל המהותי:
  `nl-spec.mjs:16,48` **משלים** רביעיית-שדות-ברירת-מחדל, ו-`tzinor.mjs:290` מפיל
  בדיוק את זה כ«המצאה». השוואת-יכולות בין השניים חייבת לשאת את ההבדל הזה.
- **`fillable.mjs` ו-`probe-pool.mjs` הם קובצי-SSOT של שורה-אחת** (4 ו-3 שורות),
  לא מנועים בעלי-אלגוריתם. הם «מחוברים» כי מייבאים אותם, וזה נכון — אבל להשוות
  אליהם מנוע-לא-מחובר יהיה חסר-משמעות.
- **57 «מחוברים» ו-57 «שערים» הם קבוצות שונות באותו גודל** (חיתוך 21) —
  `engine-index.mjs:317`. אל תערבב.

## מה לא הרצתי, ולמה (מפורש — לא "לא-רלוונטי")

| מנוע | שער | למה לא הורץ |
| --- | --- | --- |
| `app-from-sentences` | `appgen` (push) | דורש מראה ל-buildsmart ותוצרי-forge טריים; ‏`--test` מריץ `flutter test` |
| `ds-forge` | אין | כותב 359 קבצים + מניפסט — כתיבה לעץ אסורה לי |
| `render-ds` | אין | נמדד בעקיפין דרך `truth --gate` (שמייבא אותו) |
| `match` · `look` · `lift-lib` · `logic-proof` · `twins` · `fillable` | אין | אין שער בשמם; הצרכנים שלהם (‏`coverage` · `balagan` · `behavior-plan`) כותבים baselines/תוצרים |
| `site-shot` | אין | דורש `buildsmart/build/web-*` + Chromium + playwright-core — אף אחד מהם אינו בקלון הזה |
| `ship` | אין | הוא **הצינור**: מריץ regen, בונה, מקמט ודוחף. הרצה = שינוי הריפו |

## מה כן נמדד ומה לא — המספר

מתוך 29: **17 עם עדות שהורצה בסשן הזה** · **9 «לא-נמדד»** · השאר «חלקית»
(‏`quality.measured` ב-`connected-B.json` נושא את הניסוח המדויק פר-מנוע).
**אף מספר בדוח אינו מ-CLAUDE.md אלא אם נאמר במפורש שהוא משם** (הדוגמה היחידה:
‏`logic-proof`, שם 16/16 · 30/30 מסומנים כדיווח-מ-CLAUDE ולא כמדידה שלי).

## הערה טכנית אחת שנצפתה בקריאת-הקוד (לא תוקנה — אסור לשנות קוד)

`machtzev/generator/look.mjs`: המטמון בודק `CACHE.has(f)` (שורה 23) וכותב
`CACHE.set(file, ok)` (שורה 27). לקובץ שנתיבו נורמל (כל מה שאינו מתחיל ב-`dart-`,
שורה 21) המפתח שנכתב שונה מזה שנקרא ⇒ הקובץ נסרק מחדש בכל קריאה.
**השפעה: ביצועים בלבד, לא נכונות.** נרשם כאן ולא תוקן.
