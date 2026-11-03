# Genesis (Orbit) — הוראות לכל סשן
> **זה שער-הכניסה. כל מה שנלמד בדם — כבר כתוב. אל תלמד מחדש, קרא.**
> שם-הריפו (`-ai-chat-server`) היסטורי — התוכן הוא Genesis + תיק-מירון. אין כאן שרת-צ'אט.

## 1. מה המוצר ולמי
- **המוצר — "המחולל":** מנוע דטרמיניסטי שממיר **משפט בעברית ⇒ מסך/פיצ'ר Flutter עובד**,
  מורכב מקטלוג של **אטומים טהורים** (בלי מודל-שפה, אופליין, אותו קלט = אותו פלט).
- **מאיפה:** הקוד הישן של האימפריה (maor · buildsmart · yoman) פורק ל-51K+ אטומים רשומים
  ("המחצב"); כאן נבנה העץ החדש — חוטים-טהורים ⇒ קופסאות-חיווט ⇒ לוח-אם.
- **למי:** הבעלים (מאיר) והעסקים שלו — buildsmart (קבלנים), maor, yoman; התוצרים מוזרקים
  ל-buildsmart (`lib/genesis/`) ונבדקים שם ב-`flutter analyze`.
- **תיק-מירון (`meron/`):** פרויקט-אחות — אפיון מערכת ניהול-חי לל"ג בעומר במירון.
  **מחקר ואפיון בלבד, לא קוד** (136 דפי HTML). לפני עבודה שם: `meron/HANDOFF.md`.

## 2. Stack
- **Node.js 22** (נבדק v22.23.4) — כל הכלים `.mjs` · **אפס תלויות npm** (אין `package.json`, אין install).
- **Dart SDK 3.13.2** (מקובע) — אטומי-Dart, הוכחות-קופסאות, שקילות-Dart בשער-הסינתזה.
  מותקן אוטומטית ע"י `.claude/hooks/session-start.sh` ל-`~/dart-sdk`.
- Flutter — **לא כאן**; ההידור המלא רץ ב-buildsmart (workflow ‏`genesis-compile`).
- אין CI בריפו הזה (אין `.github/`) — המשטרה המקומית היא השער.

## 3. פקודות (הורצו ואומתו 3.11.2026)
```bash
# install — אין. רק לוודא Dart ב-PATH (ה-hook מתקין; ידנית:)
bash .claude/hooks/session-start.sh && export PATH="$HOME/dart-sdk/bin:$PATH"

# test — המשטרה (חובה לפני כל commit)
node machtzev/police.mjs --fast      # ~70ש': חיווט·חוזה·מחצבה·freeref·טוהר·הרכבה·סינתזה·כיסוי·pins
node machtzev/police.mjs             # סוף-גל: + boxes + selftest + mutation (דקות)

# test — ממוקד
node machtzev/wiring-check.mjs ./new     # חוקי-החשמלאי (6,514 קבצים)
node machtzev/contract-check.mjs ./new   # חוזה+בדיקה לכל אטום (1,239)
node --test new/board.test.mjs           # לוח-האם

# lint — אין linter נפרד; השערים הם ה-lint. ל-Dart טהור:
dart analyze runtime/
# (קבצי new/dart* תלויים ב-Flutter ⇒ analyze שלהם רק ב-buildsmart)

# build — המנוע-האחד (כל הצינור + משטרה ⇒ machtzev/ONE-STATUS.md)
node machtzev/one.mjs                # --full למשטרה-מלאה. ⚠️ דוחף ל-buildsmart כשיש שינוי
node engine/generate.mjs             # המחולל-הנקי: engine/specs/*.txt ⇒ engine/out/screens/*.dart
```
> exit 0 = ירוק. פלט "🚨 המשטרה אדומה" = exit 1. מצב-השערים הנוכחי — ב-`STATUS.md`.

## 4. ארכיטקטורה (קצר)
```
new/atoms/        אטומי-JS: X.mjs + X.contract.md + X.test.mjs (אפס imports פנימיים)
new/boxes/        קופסאות-JS — מייבאות רק atoms/
new/board.*       לוח-האם — היחיד שמייבא boxes/
new/dart*/        אותו עץ ב-Dart (dart · dart-maor · dart-boxes · dart-data-* · dart-ui-bs …)
                  QUARANTINE/ = אטומי חוב-המרה, לא נכנסים למדף
machtzev/         המפעל והמשטרה: police.mjs · one.mjs · *-check.mjs · generator/ · emit/ · gates.tsv · pins.sha256
engine/           המחולל-הנקי (generate · atlas · lib) + catalog/ knowledge/ specs/ — אפס-דאטה בליבה
runtime/          engine_api.dart/.js — ממשק-הריצה
screens-seed/     מניפסטים ומיפוי-מסכים · box-drafts/ — תוכניות-קופסה
design/           דפי-עיצוב (HTML) · knowledge/ — מסמכי-תכנון/סגירה
meron/            תיק-מירון (HTML+`_style.css`, RTL)
WIRING.md         מפת-החיווט — **מחוללת** (`gen-wiring-doc.mjs`), לא לערוך ידנית
```
חוקי-החיווט (LAW.md): אטום לא מייבא אטום · קופסה לא מייבאת קופסה · רק הלוח מייבא קופסאות.

## 5. סדר-קריאה חובה (לפני עבודה על Genesis)
1. `LAW.md` — 7 חוקי-החשמלאי · 2. `PURPOSE.md` — מטרת-הטיהור (אין דאטה באטום. נקודה.)
3. `machtzev/LEARNINGS.md` — לקחים (L1…); כל בריחה הופכת לחוק כאן, באותו סשן
4. `machtzev/AGENT-CODE.md` — המגילה לכל סוכן-גל · 5. `machtzev/CURRICULUM.md`
6. `machtzev/DECISIONS.md` — הכרעות-הבעלים הממוספרות (מצטטים "הכרעה N")
7. `HANDOFF-MASTER.md` — מסירת-הפרויקט-כולו · `WIRING.md` — מפת-החיווט

## 6. מוסכמות
- **אטום = יכולת טהורה:** קוד + `.contract.md` + בדיקה ירוקה. אפס דאטה/עברית/קבועים בפנים —
  הכל מוזרק דרך מטרה (`term('entity.family')`). צריבה = חסימת-המחולל (PURPOSE.md).
- **חוזה-קודם; הקוד-החלוץ קדוש** — חוזה מתכופף למקור (L4). בודק-נכשל ⇒ חשוד בבודק (L1).
- **מחגרים רק-יורדים:** קבצי `*-baseline.json` — החוב רק יורד; לעולם לא להעלות baseline כדי לעבור.
- **קבצים נעולי-חתימה** (`pins.sha256` — כולל CLAUDE.md ו-LAW.md): כל שינוי בהם ⇒ `node machtzev/pins-check.mjs --write` **באותו commit**.
- **שערים** רשומים ב-`machtzev/gates.tsv`; כל שער פולט `ran <id>` — מחיקת-שער מפילה.
- **זהות/סודות = חיווט-הצבה**, לעולם לא אטום (חוק-6). PII נסרק בשער-החוזה.
- **קבצים מחוללים** (WIRING.md, ONE-STATUS.md, READINESS.md, `out/`) — מחוללים, לא נערכים ידנית.
- **פסק-דין רק על עץ נח (L14)** — לא להריץ משטרה תוך כדי כתיבה.
- **commits:** קידומת-תחום בעברית/אנגלית (`מנוע · …`, `meron: …`), הודעה שאומרת מה ולמה.
- **מירון:** כל קובץ HTML עם `dir="rtl"` + `<link rel="stylesheet" href="_style.css">`; עברית פשוטה;
  מספרים מסומנים "הערכה"/מקור; נושא אחד בכל פעם; לא לבנות קוד בלי בקשה מפורשת.

## 7. כללי עבודה (מחייבים)
- **עברית תמיד** — בתשובות, בדוחות, במסמכים. קצר וברור, עם סטטוס: מה גמור ומה נשאר.
- **מינימום מאה אחוז:** לא אומרים "גמור" בלי הוכחה — פלט בדיקות/משטרה ירוקה, צילום-מסך
  (Playwright) לכל דבר ויזואלי. אדום = לא גמור, ומדווחים עליו בפה מלא.
- **ענפים בלבד:** כל עבודה בענף `claude/*`. ענף-הבסיס (ברירת-המחדל) של הריפו: `claude/mah-kora-0by8kw`.
- **אסור בלי אישור מפורש של מאיר:** push ל-main/ענף-הבסיס · מיזוג PR · פרסום לריפו ציבורי
  או לרשת · מחיקת קבצים/ענפים · שליחת מיילים/הודעות · תשלום. PR נפתח כ**טיוטה** בלבד.
- **צעדים הפיכים** (עריכה, commit+push לענף-עבודה, הרצת בדיקות) — עושים ברצף בלי לעצור לשאול.
- **אין sleep/polling;** רשתות-ביטחון ב-`send_later`. commit+push לענף בכל נחיתה.
- **cutover רק לפי חוק-7:** טוען-לצד, דגל-הפיך.
- `node machtzev/one.mjs` דוחף ל-buildsmart — רק בענף-עבודה שם, לעולם לא ל-main שלו.

## 8. 🌊 גלי-נחיל
פרומפט-גל = "לבש את המגילה: machtzev/AGENT-CODE.md. המשימה: …" + schema מובנה.
רשימות-עבודה תמיד מ-ls (L5), חלוקה לקבצים-זרים, אפס-git לסוכנים, מאמת-עוין צמוד
(bytes-not-prose), משטרה בסוף. תבנית-workflow: promotion-engine-wave1*.js.

## 9. כלי-המפעל הנוספים
```bash
node machtzev/gen-wiring-doc.mjs    # חילול WIRING.md
node machtzev/box-coverage.mjs      # מד-מוכנות-קופסאות ⇒ box-drafts/READINESS.md
node machtzev/dedup-atoms.mjs       # כפליות-מדף (הכרעה 5) — אחרי כל גל
node machtzev/dedup-cross.mjs       # כפליות חוצות-מערכות לפי שם (JS↔Dart)
node machtzev/dedup-cross-dart.mjs  # כפליות Dart↔Dart לפי גוף
node machtzev/promote-auto.mjs      # קידום-חינם: צילום/Golden
```
מרשם-האטומים המלא חי בריפו maor-system (`machtzev/registry/`, לא כאן — ב-.gitignore).

## 10. ⚠️ אזהרות שנקנו ביוקר
- buildsmart: קו-האמת = main (יושר 23.8); אינו multi-tenant (L16).
- זהות/סודות = חיווט-הצבה, לעולם לא אטום (חוק-6, אזעקת-אבטחה 24.8).
- שער-הסינתזה משווה JS מול Dart רק כש-`dart` ב-PATH — בלי Dart הוא "ירוק" חלקית.
- מצב נוכחי, בעיות פתוחות ו-Next: **`STATUS.md`**.
