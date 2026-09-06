# 🧬 HOWTO · המחולל — ממשפט בעברית לאפליקציה ולאתר (4.9.2026)

> מדריך-שימוש לבעלים. כל שלב = פקודה אחת, דטרמיניסטית, בלי סוכנים ובלי LLM בייצור (הכרעה-24 · §20-ד). מה שהמנוע לא יודע — הוא **מדווח** (מקום-שמור), לא ממציא.

## 1 · כותבים משפטים
קובץ `machtzev/generator/app-golden-N.json`:
```json
{ "name": "Kehila", "sentences": ["ניהול מתנדבים עם טלפון ואזור", "רשימת תרומות לפי תאריך וסכום", "מעקב חדרים ושעות"] }
```
- כל משפט ⇒ **ישות אחת** מהסכמה (מונחי `entity.*` של TERM_DEFS + ריבוי/קידומת/חלופות-'/'): "מתנדבים" ⇒ Volunteer · "תרומות" ⇒ Donation · "חדרים" ⇒ Room. שני מונחים באותו משפט ⇒ הספציפי-יותר (הצורה הארוכה) מנצח; שוויון מלא ⇒ הראשון בטבלה, מדווח.
- משפט בלי מונח-ישות ("רשימת ספקים עם מחירים") ⇒ ⚪ מדווח, לא מומצא. ישות חוזרת ⇒ ⚪ מדווח.
- ~~ישויות בלי מונח~~ נסגר (G15): מסירה · שיחה · חיוג · תיק ב-TERM_DEFS. מונח בלי ישות-סכמה (תלמיד) ⇒ `"aliases": {"entity.student": "Member"}` בספק. הנושא הוא לפני מילת-היחס ("מסירות לפי מתנדב" ⇒ Delivery).

## 2 · מחוללים
```bash
cd /home/user/-ai-chat-server
node machtzev/generator/app-from-sentences.mjs            # כל app-golden*.json ⇒ מודולים + רכזת + נקודת-כניסה + בדיקה
node machtzev/generator/app-from-sentences.mjs --gate     # ≡ מחולל-טרי (דטרמיניזם)
node machtzev/generator/app-from-sentences.mjs --gate --test   # + flutter test של הבדיקות המחוללות (ב-buildsmart)
node machtzev/generator/app-from-sentences.mjs --gate --build  # + flutter build web לכל אפליקציה (כבד, ~35s/אפליקציה)
```
פלט ב-`new/dart-gen-bs/` (מראה ב-`buildsmart/app_flutter/lib/genesis/dart-gen-bs/`):
- `gen_retarget_<entity>_from_<mod>.dart` — מודול-מסך שלם: מודול-הזהב הקרוב-ביותר (לפי שמות-שדה+צורת-טיפוסים) **מוסב** לישות: מפתחות · מונחים · עמודות-מקום-שמור (G5h) · גרעין-מחזור-חיים (G6c/d, כשיש `gen_core_<entity>`) · `<E>Facts` (count חי · מדדים · hero · שורות-מדד · תפרי-כניסה/סינון/הזרקה).
- `gen_app_<name>.dart` — הרכזת: חיפוש (צורת-האיתור של הזהב) · KPI נגזר פר-מודול · אריחי-ניווט עם מונים · אריח-hero לחיץ ⇒ המודול נפתח **על הרשומה שדורשת פעולה** עם הטבלה מסוננת למדד.
- `gen_main_<name>.dart` — נקודת-כניסה (`runApp`).
- `buildsmart/app_flutter/test/genesis_gen_app_<name>_test.dart` — בדיקה מחוללת: בית · חיפוש · hero-jump · הזרקה · ניווט לכל מודול.

## 3 · מאמתים
```bash
cd /home/user/buildsmart/app_flutter
flutter analyze --no-fatal-infos --no-fatal-warnings lib/genesis        # 0 errors
flutter test test/genesis_gen_app_<name>_test.dart                      # הבדיקה המחוללת
cd /home/user/-ai-chat-server && node machtzev/generator/gen-verify.mjs --gate   # רנדר-בפועל של כל פלטי-המחולל + סריקת-טאפים
```
ב-push המשטרה מריצה את הכול באמת (רתמת-הזהב 87/87 · gen-verify · appgen --test) — `BUILDSMART` מיוצא מה-hook (L63).

## 4 · אתר
```bash
cd /home/user/buildsmart/app_flutter
flutter build web --release --no-web-resources-cdn -t lib/genesis/dart-gen-bs/gen_main_<name>.dart -o build/web-<name>
cd /home/user/-ai-chat-server && node machtzev/tools/site-shot.mjs <name> <Title>   # מגיש · מאתחל ב-Chromium · מצלם ל-audit/goals
```
`--no-web-resources-cdn` חובה לאתר עצמאי (CanvasKit מקומי); הגופן-המצורף (`DsTokens.fontBody`) מונע היעלמות-טקסט בלי רשת (L69).

## 4½ · עור-forge (G12–G13)
`app-golden*.json` / `skin-golden.json` מצהירים `skin: { kpi, hero, stat, navTile, button, statusChip, banner, emptyState, mediaRow, section, frame, segmented, chip, meter, glass, timeline }` ⇒ אטום-forge לכל תפקיד. המנוע מאמת מבנית (חריצים · child · items · values) ומסרב לאטום לא-מתאים. אטומי-forge מחוללים מ-Pure (`node machtzev/ds-forge.mjs` — תמיד מלא) עם התפרים: `fields` · `items/selected/onSelect` (+ תאים `items[i][j]` · `columns` · `variants`) · `values` (אחוזים ובארי-SVG) · `control` · `onAction` · `child` · `bare`; null ⇒ תוכן-העיצוב ביט-זהה. תפקידי-skin: kpi·hero·stat·navTile·button·statusChip(+toneMap)·banner·emptyState·mediaRow·section·frame·segmented·chip·meter·glass·timeline·field·enumField·numberField·dateField·search·pageHeader·table·bars. גופני-Pure (Fraunces · Space Grotesk · Frank Ruhl Libre · Heebo) ב-pubspec של בנייה-חכמה.

## 4¾ · הפקודה האחת (G13f)
```bash
cd /home/user/-ai-chat-server
SESSION_URL=<קישור-סשן> node machtzev/generator/ship.mjs --msg "גל G… · …" --lesson L77   # regen ⇒ מראה ⇒ אימות ⇒ שערים ⇒ בנייה ⇒ צילום ⇒ gh-pages ⇒ commit×2 ⇒ push
```
כל מה שבסעיפים 2–4 נעשה ידנית — עכשיו פקודה אחת בסדר קבוע. `--full-verify` מוסיף gen-verify; `--no-build --no-deploy --no-commit --no-push` לשלבים.

## 5 · מה יש היום (אמת, 6.9.2026)
| מדד | ערך |
|---|---|
| אפליקציות מ-`app-golden*.json` | 3 (Audit 0 · Bind1 0 · Bind2 0 · Bind3 0 · Bind4 0 · Bind5 0 · Bind6 0 · Ent1 0 · Ent2 0 · Ent3 0 · Ent4 0 · Ent5 0 · Ent6 0 · Flags 0 · Hub 0 · Kehila 6 · Main 0 · Over1 0 · Over2 0 · Over3 0 · Rec1 0 · Rec2 0 · Rec3 0 · Rec4 0 · Rec5 0 · Rec6 0 · Scr7 0 · Settings 0 · Studio 6 · Tzedaka 7) — 19 מודולים · 16 ישויות · 9 מודולי-זהב כמקור · **כולן בעור-forge מוצהר** (`skin` בספק) |
| בדיקות מחוללות + forge/seams | 156/156 (17 קבצי `genesis_*`, מורצות ב-`ship`) |
| רנדר-בפועל (gen-verify) | 74/111 פלטי-מחולל · 52 אטומי-תצוגה (DS+forge) · 203 טאפים · 0 חריגות |
| רתמת-הזהב | 9/9 מודולים · 87/87 בדיקות |
| אתרים | 4 אתרי-דמו ב-gh-pages (`/schoolos/ /studio/ /kehila/ /tzedaka/`) ≡ הבנייה המקומית · ראיית-תלמידים `machtzev/audit/goals/gen_app_studentsforge_web.png` |

## 6 · גבולות (כנות)
- **הבחירה `ישות ⇐ מודול-זהב` מבנית** (שמות-שדה+טיפוסים): Teacher ⇐ students, ShopProduct ⇐ rooms — עובד, מוצהר בכותרת; המשמעות = הצבה, לא טענת-אמת.
- **הזרע = זרע-ההצבה של הזהב** (לא נתוני-הארגון). דאטה אמיתית נכנסת דרך תפרי-ההזרקה (`db` — כיום רק במודולים-מבוססי-תלמידים) — הרחבה = חלון-בעלים.
- **תוויות** במונחי-המקור כשאין מונח-יעד ב-TERM_DEFS (למשל רבים חסר).
- מודולים מ-fees/dashboard: אין מדד בצורת-where ⇒ hero=count, בלי קפיצה/סינון.
- הכרעות-בעלים פתוחות: policy-config · מגמת-KPI (היסטוריה) · פערי-זרע/סכמה · מונחי-רבים. (~~student⇒Member~~ ו~~4 ישויות-הגרעין~~ נסגרו בהצהרה — G15.)

הכול מתועד: `knowledge/PLAN-GENERATOR-MAX-2026-09-04.md` §7 (מצב-חי) · `knowledge/CLOSED-GENMAX-G*.md` (דוח פר-שלב) · `machtzev/LEARNINGS.md` L51–L82.

מסירה מרוכזת לסשן חדש: `knowledge/HANDOFF-GENMAX-2026-09-06.md`.
