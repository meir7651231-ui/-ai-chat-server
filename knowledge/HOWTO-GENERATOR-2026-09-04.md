# 🧬 HOWTO · המחולל — ממשפט בעברית לאפליקציה ולאתר (4.9.2026)

> מדריך-שימוש לבעלים. כל שלב = פקודה אחת, דטרמיניסטית, בלי סוכנים ובלי LLM בייצור (הכרעה-24 · §20-ד). מה שהמנוע לא יודע — הוא **מדווח** (מקום-שמור), לא ממציא.

## 1 · כותבים משפטים
קובץ `machtzev/generator/app-golden-N.json`:
```json
{ "name": "Kehila", "sentences": ["ניהול מתנדבים עם טלפון ואזור", "רשימת תרומות לפי תאריך וסכום", "מעקב חדרים ושעות"] }
```
- כל משפט ⇒ **ישות אחת** מהסכמה (מונחי `entity.*` של TERM_DEFS + ריבוי/קידומת/חלופות-'/'): "מתנדבים" ⇒ Volunteer · "תרומות" ⇒ Donation · "חדרים" ⇒ Room. שני מונחים באותו משפט ⇒ הספציפי-יותר (הצורה הארוכה) מנצח; שוויון מלא ⇒ הראשון בטבלה, מדווח.
- משפט בלי מונח-ישות ("רשימת ספקים עם מחירים") ⇒ ⚪ מדווח, לא מומצא. ישות חוזרת ⇒ ⚪ מדווח.
- ישויות בלי מונח כיום (לא נגישות במשפט): Delivery · CallEntry · DialLogEntry · AyinCase — צריך `entity.*` ב-TERM_DEFS של מאור (הכרעת-בעלים).

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

## 5 · מה יש היום (אמת, 4.9.2026)
| מדד | ערך |
|---|---|
| אפליקציות מ-`app-golden*.json` | 3 (Kehila 5 · Tzedaka 7 · Studio 6) — 18 מודולים · 15 ישויות · 7 מודולי-זהב כמקור |
| בדיקות מחוללות | 13/13 · 17/17 · 16/16 |
| רנדר-בפועל (gen-verify) | 52/90 פלטי-מחולל · 211 טאפים · 0 חריגות (ה-37 שלא רונדרו = פלטי-מנוע-ישן, לא STRICT) |
| רתמת-הזהב | 9/9 מודולים · 87/87 בדיקות |
| אתרים | 3/3 נבנים ומאותחלים (ראיות ב-`machtzev/audit/goals/gen_app_*_web.png`) |

## 6 · גבולות (כנות)
- **הבחירה `ישות ⇐ מודול-זהב` מבנית** (שמות-שדה+טיפוסים): Teacher ⇐ students, ShopProduct ⇐ rooms — עובד, מוצהר בכותרת; המשמעות = הצבה, לא טענת-אמת.
- **הזרע = זרע-ההצבה של הזהב** (לא נתוני-הארגון). דאטה אמיתית נכנסת דרך תפרי-ההזרקה (`db` — כיום רק במודולים-מבוססי-תלמידים) — הרחבה = חלון-בעלים.
- **תוויות** במונחי-המקור כשאין מונח-יעד ב-TERM_DEFS (למשל רבים חסר).
- מודולים מ-fees/dashboard: אין מדד בצורת-where ⇒ hero=count, בלי קפיצה/סינון.
- הכרעות-בעלים פתוחות: policy-config · student⇒Member · פערי-זרע/סכמה · מונחי-רבים · מונחים ל-4 ישויות-הגרעין.

הכול מתועד: `knowledge/PLAN-GENERATOR-MAX-2026-09-04.md` §7 (מצב-חי) · `knowledge/CLOSED-GENMAX-G*.md` (דוח פר-שלב) · `machtzev/LEARNINGS.md` L51–L74.
