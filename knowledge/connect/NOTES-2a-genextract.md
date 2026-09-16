# NOTES · 2א — gen + engine + audit + tools + dedup + extract (60 מנועים · 4,026 שורות)

## 0 · סטיות מההוראה, וההחלטה שלקחתי

**HEAD אינו `52dc8d56`.** קיבלתי `60ad1b72`, שהוא **שני קומיטים אחרי**:
```
$ git log --oneline -3
60ad1b7 שמות-הריפואים-האחים ב-GitHub + תוכנית-המוסד כ-markdown
5b45a0c knowledge/assets — נכסי-מחקר נשמרים מהמחיקה…
52dc8d5 «57 מחוברים» הופך לפקודה…
```
‏`52dc8d5` הוא אב-קדמון של HEAD. **החלטה:** ממשיכים — הסשן נפתח על `claude/mizug`
שהתקדם בינתיים, ושני הקומיטים נגעו ב-`knowledge/` ו-`CLAUDE.md` בלבד, לא בקוד-מנוע.
לא BLOCKED.

**`--connected` נתן 57 · 285 · 342, לא 57 · 279 · 336.** אותם שני קומיטים הוסיפו 6 קבצים
שנספרים כמנועים (‏`knowledge/assets/…`). המספר שחשוב למשימה — **המחוברים — זהה: 57.**
```
$ node machtzev/census/engine-index.mjs --connected
מחוברים-למחולל: 57 · לא-מחוברים: 285 · (מתוך 342 בריפו)
```

**הרשימה שלי יצאה בדיוק 60** (`wc -l /tmp/my-list.txt` ⇒ 60). סכום-השורות:
**4,026** לפי `engine-index.json` · **3,966** לפי `wc -l`. ההפרש קבוע, 1 לקובץ — האינדקס
סופר `split('\n').length` (שורה-ריקה בסוף). שניהם נכונים, רק ההגדרה שונה.

## 1 · המספרים של הדוח — כל אחד עם הפקודה
```bash
node -e "const a=require('./knowledge/connect/2a-genextract.json');
  const d={}; for(const e of a) d[e.s22.score]=(d[e.s22.score]||0)+1;
  console.log(a.length, JSON.stringify(d),
    'ללא-קורא:', a.filter(e=>e.callers.every(c=>c.who==='∅')).length,
    'ללא-נקודת-חיבור:', a.filter(e=>e.connectAt.point==='∅').length,
    'עם-ראיית-ריצה:', a.filter(e=>e.evidence.some(x=>x.startsWith('ran:'))).length)"
```
⇒ `60 {"0":11,"1":23,"2":19,"3":7} ללא-קורא: 5 ללא-נקודת-חיבור: 7 עם-ראיית-ריצה: 60`

**‏60/60 נושאים לפחות ראיית-`ran:` אחת.** ‏238 טענות-«עושה» · 197 עובדות-שלילה.

**s22 = 3 (שבעה):** `gen/prove.mjs` · `gen/prove-dart.mjs` · `gen/engine.mjs` ·
`gen/render.mjs` · `gen/build.mjs` · `gen/lenses.mjs` · `machtzev/audit/heal.mjs`.
**s22 = 0 (אחד-עשר):** ‏7 מחלצים · `dedup.mjs` · `dedup-cross.mjs` · `tools/refine.mjs` ·
`gen/packs-apply.mjs`.

## 2 · דפוסים חוזרים שנמדדו

### א׳ · תשע משכבות-האטומים נכתבות ואיש אינו קורא אותן
```bash
for L in L0 L0b L1 L2 L4 L5 L5b L6 L6b L7 L8 L9 L10 L11 L12; do
  grep -rln "atoms-${L}-" --include=*.mjs . | grep -v node_modules; done
```
צרכן **מלבד המחלץ עצמו** יש רק ל-`L0` · `L0b` · `L5b` · `L6` · `L6b` · `L12`.
‏**`L1 · L2 · L4 · L5 · L7 · L8 · L9 · L10 · L11` — אפס צרכנים.** תשעה מ-15 המחלצים
כותבים לקובץ שאיש לא פותח. זה לא «לא מתועד» — זה נמדד.

### ב׳ · 18 מנועים שהצינור שלהם מת מלמעלה
```
$ node machtzev/extract/tokens.mjs maor
Error: ENOENT … machtzev/registry/census-maor.json
$ ls machtzev/registry/  ⇒  No such file or directory
```
‏`machtzev/run.mjs:11` בונה את ה-registry רק אם `/home/user/maor-system` קיים — והוא אינו
קיים **בשום מקום** (‏CLAUDE.md). לכן `extract/*` (15) · `dedup/dedup.mjs` ·
`dedup/dedup-deep.mjs` · `dedup/reconcile.mjs` — **18 מנועים שלא יכולים לרוץ כאן.**

### ג׳ · ירוק-שקרי מסוכן יותר מקריסה
‏`machtzev/tools/refine.mjs:5` עוטף כל טעינה ב-`try{…}catch{return []}` ⇒ בקלון-טרי:
```
$ node machtzev/tools/refine.mjs ; echo $?
זיקוק: 0 מנועים-תאומים · 0 מחרוזות-קשיחות · 0 ערכי-צבע כפולים ⇒ REFINE-REPORT.md
0
```
**אפס-מקור ואפס-ממצא נראים זהה, והוא כותב דוח.** `dedup.mjs`/`dedup-deep.mjs` משתמשים
באותו `load()` אבל קורסים קודם ב-`readdirSync(R)` — ההבדל בין «קורס» ל«ירוק-שקרי» מקרי.

באותה משפחה: **`machtzev/audit/diff.mjs` רץ ירוק על אפס אטומים** —
`✓ diff: 0 הושוו · נקי 0 · ממוצע 0%`, exit 0 — ומוסיף שורה ל-`history.jsonl`.

### ד׳ · שלושה מנועים, שלוש הגדרות אחרות ל«איפה Dart»
בסביבה הזו `dart` הוא **`/root/dart-sdk/bin/dart`** (`which dart`).
| מנוע | ההגדרה | התוצאה |
|---|---|---|
| `gen/prove-dart.mjs:12` | 3 נתיבים ואז **נפילה ל-`'dart'` שב-PATH** | ✅ 394 אטומי-Dart הוכחו בריצה |
| `machtzev/tools/dart-test.mjs:5` | `/home/user/flutter/bin/dart` קשיח, בלי נפילה | ❌ `Dart: 0/345 · 345 נכשלו`, exit 1 — **345 כשלים שאינם אמיתיים** |
| `machtzev/audit/run.mjs:10` | `/home/user/flutter/bin/flutter` קשיח | ❌ חסר, הצינור נופל |

### ה׳ · שערים שאיש אינו מפעיל
שלושה מנועים מחזיקים `--check`/`--strict` שלא מחובר לשום מקום:
`gen/detach.mjs` · `gen/skin.mjs --check` · `machtzev/tools/box-coverage.mjs --strict`
(`one.mjs:177` מריץ אותו **בלי** הדגל וב-`optional:true`).
‏`machtzev/audit/heal.mjs` — פסק-דין מלא (`exit 2`) בלי אף קורא בקוד.

## 3 · שלושה ממצאים קשיחים (לא תוקנו — מיפוי בלבד)

1. **`gen/detach.mjs --check` נכשל היום, exit 1.** הטענה «gen נתיקה» חיה בשלושה מסמכים
   (`gen/DETACH.md:66` · `gen/MOSAD.md:101` · `gen/packs/README.md:16`) והיא **שקרית ב-HEAD**:
   `machtzev/INDEX.md` רשום · `engine-index.json` מזכיר 8 קבצי-gen · **`studio-full.mjs:19`
   כותב ל-`gen/out`**. התגלה רק מהרצה.
2. **`machtzev/chisel.mjs:38` קורא לקובץ שאינו קיים** — `machtzev/promote-auto.mjs`;
   הקובץ נמצא ב-`machtzev/tools/promote-auto.mjs`. `ls` ⇒ No such file.
   זה הקורא **היחיד בקוד** של promote-auto, כלומר הקריאה מתה.
3. **`gen/flutter.mjs:14` (`toSpecDs`) מוחק מידע בשקט** — `[תאריך]`·`[טלפון]`·טווח-מספר,
   וארבעה קטעי-ישות שלמים (`אסור`·`הרגע`·`מסך`·`תיקון`) נמחקים לפני שהספק מגיע ל-`app-ds`.
   אין הערה בדוח.

עוד, קטנים: `machtzev/extract/flags.mjs:11` השמה שאינה נצרכת (קוד-מת) ·
`machtzev/dedup/dedup.mjs:67-68` מונה `undecided` שלעולם נשאר 0 · `dedup.mjs:27` מול `:35`
סתירה «≥5 מופעים» בהערה מול `>= 2` בקוד · `gen/sentence.mjs:108` `${…}` בתוך רגקס-ליטרל
שאינו מורחב · `gen/engine.mjs:41` `new Date()` שאינו עובר דרך ה-`now` המוזרק ⇒
כל בנייה משנה שלושה קבצים מחויבים.

## 4 · הכפילויות — אותו מנוע פעמיים

| כאן | המקור/המחליף המחובר | ההבדל |
|---|---|---|
| `engine/lib.mjs` | `machtzev/assemble/lift-lib.mjs` | **עותק verbatim מוצהר**, בלי שער-סנכרון. תיקון-באג בסורק-Dart חייב לקרות פעמיים |
| `engine/atlas.mjs` | `machtzev/generator/atlas.mjs` | שניהם `buildAtlas`; המחובר נקרא ע"י 8+ מנועים, זה — ע"י אחד |
| `gen/site.mjs` | `machtzev/generator/web-shell.mjs` (G52) | ‏web-shell עם זהות+PWA+SW מאומת; `site.mjs` מעתיק 11 תיקיות לריפו אחר בלי גיבוי |
| `gen/packs-apply.mjs` | `gen/mosad-build.mjs:37-56` | אותו קוד; ב-mosad-build שלבים **מאוחדים** ולא נדרסים + ניקוי-יתומים + `fix`. packs-apply אינו הפיך |
| `machtzev/tools/refine.mjs` | `machtzev/dedup/dedup.mjs:40-64` | אותם שני שלבים, שם עם ניקוד ואינווריאנט-כיסוי-100% |
| `machtzev/dedup/dedup-cross.mjs` | `dedup-cross-dart.mjs` | זה משווה **שמות**, זה **גוף**. הראשון אינו בצנרת |
| `machtzev/extract/engines.mjs` | `machtzev/census/engine-index.mjs` | האחרון עושה אותו דבר טוב יותר, על הריפו הזה |

## 5 · מה הצלחתי להריץ ומה לא

| רץ ירוק | ראיה |
|---|---|
| `node gen/build.mjs gen/specs/gemach.txt` | 9 אטומים מוכחים · 0 ללא-הוכחה · 28,726ms; JS 569 נוסו · Dart 394 נוסו |
| `node gen/skin.mjs --check` | 140 הצהרות-טוקן · 62,544 תווי-CSS · «אפס ליטרל-צבע · אפס מארח חיצוני · גופן מוטבע» |
| `node engine/generate.mjs` | `engine · 1 screens · atlas: 5 widgets · 0 functions · 0 data` |
| `node machtzev/audit/gen-orig.mjs chat` | 6 PNG ⇒ shots/orig (Playwright ב-`/opt/pw-browsers/chromium`) |
| `machtzev/audit/lib.mjs` · `features.mjs` | `allAtoms = 359 · families = 17` · **174/359** עם תכונת-CSS-קשה |
| `dedup-atoms` · `dedup-cross` · `dedup-cross-dart` | 1,160 אטומי-מדף · 2 תאומי-גוף · 2 תאומי-שם · 49 תאומי-מוצא · 4 מועמדי-ליבה-אימפריאלית |
| `box-coverage` · `gen-wiring-doc` · `promote-auto` | 46/60 קופסאות · 1012/1160 מחווט (87%) · 0 קודמו (‏`quarry/` אינה קיימת) |

| לא רץ | הסיבה (נמדדה) |
|---|---|
| 15 × `extract/*` · `dedup{,-deep}` · `reconcile` | ENOENT `machtzev/registry/` |
| `audit/gen-forge-dart` · `audit/run` · `audit/heal` · `gen/site` | `/home/user/buildsmart/app_flutter` + `/home/user/flutter` חסרים |
| `tools/dart-test` | נתיב-Dart קשיח שאינו קיים (רץ, אבל 345 הכשלים אינם אמיתיים) |

**שלושה שלא הרצתי בכוונה, ואמרתי זאת בערך עצמו:**
`gen/pass.mjs` (בונה 12 אגפים ומריץ `app-ds.mjs` שכותב מחוץ ל-`gen/`) ·
`gen/mosad-build.mjs` ו-`gen/packs-apply.mjs` (דורסים `mosad.data.json` המחויב;
mosad-build חותם `built: new Date()` ⇒ העץ ישתנה בכל ריצה) ·
`gen/studio.mjs`/`gen/wizard.mjs` (כותבים `gen/out/*.html` + `gen/lang.data.json`).
טענה אחת ב-`gen/wizard.mjs` (פער-ה-`SKIN_PRELUDE`) היא **מהקוד ולא מהריצה**,
וכתוב שם במפורש שלא אימתתי אותה — ולכן הציון 1 ולא יותר.

**ניקיון:** כל מה שהרצתי והשאיר עקבות הוחזר — `git checkout -- gen/` אחרי build ·
`rm -rf machtzev/audit/shots` · `rm -f machtzev/tools/REFINE-REPORT.md`.
`git status --porcelain` נקי מלבד `knowledge/connect/`.

## 6 · הכרעות-שיפוט שלי

- **«מי קורא» לפי נתיב, לא לפי שם.** ‏grep על שם-בסיס מחזיר המון שווא
  (‏`new/atoms/icons.mjs` ≠ `machtzev/extract/icons.mjs` · `new/boxes/dedup.mjs` ≠
  `machtzev/dedup/dedup.mjs`). כל שורת-`callers` אומתה מול הנתיב היחסי שבשורת-ה-`import`/`run`.
- **`machtzev/one.mjs` ו-`machtzev/run.mjs` הם קוראים, אך אינם `GEN_ENTRY`.** לכן מנוע
  שהם מריצים נשאר ○ — וזה נכון: הוא בצנרת-**המפעל**, לא בצנרת-**המחולל**.
- **ציון s22 לפי «מה נשבר אם אמחק»:** ‏3 = מממש את §20/§22 עצמם (הוכחה-בריצה · הרכבה
  מאטומים-מוכחים בלבד · תקן-מדוד-ובטל) · 2 = יכולת אמיתית שמחכה לחוט אחד · 1 = מקרב את
  המפה/האמון, לא את האפליקציה · 0 = לא מקרב, ואני אומר זאת במפורש.
- **לא נתתי 3 לשום מנוע שלא ראיתי רץ**, למעט `machtzev/audit/heal.mjs` — שם הציון ניתן
  על **המנגנון שקראתי בקוד** (ביטוח-מלא על 353 + ביטול-אוטומטי), והכתוב אומר במפורש
  שהוא אינו יכול לרוץ כאן ושאין לו קורא.

## 7 · שלוש נקודות-החיבור שהייתי מציע ראשונות (מיפוי, לא המלצה לבצע)

1. **`machtzev/audit/heal.mjs` ⇒ `machtzev/one.mjs:193`** — זו הלולאה-הירוקה של הכרעה-21
   על שכבת-המראה, והיא קיימת ולא מופעלת. תנאי-קדם: להוציא את `--commit` מהנתיב האוטומטי
   (‏`heal.mjs:103-106` דוחף לענף קשיח בשני ריפואים).
2. **`gen/lenses.mjs` ⇒ `machtzev/generator/app-ds.mjs`** — 12 שאלות מכניות שאפשר לענות
   עליהן רק מהספק, כולל `no-grammar` שמונה במפורש אילו שאלות **אין למחולל דקדוק** לבטא.
   זו מפת-הפערים של המחולל, נגזרת ולא כתובה ביד.
3. **`machtzev/tools/dart-test.mjs` ⇒ הצנרת, אחרי תיקון שורה 5** — 345 בדיקות-החוזה של
   `new/dart` אינן נבדקות היום ע"י אף שער. שורה אחת (גילוי-Dart כמו `one.mjs:186`)
   מפרידה בין 345 כשלי-נתיב לבין 345 ראיות-ריצה.
