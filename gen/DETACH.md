# gen · המחולל הטהור — הפיך ונתיק

## מה זה
מחולל חדש, בלי מודל ובלי רשת: ספק בעברית ⇒ צרכים מצורת-השדות ⇒ הוכחה-בריצה של כל אטום במדף
(`new/atoms`) על דוגמאות מחייבות ⇒ הרכבה לאפליקציה רצה בקובץ-HTML יחיד + דף-לייב שמראה את כל הריצה.
```bash
node gen/build.mjs gen/specs/gemach.txt   # ⇒ gen/out/gemach/{app.html, live.html, report.json, log.md}
node gen/studio.mjs                       # ⇒ gen/out/studio.html — הסטודיו: תיבה ריקה, המחולל רץ בדפדפן (המדף ארוז בפנים)
```
אותה ליבה (`engine.mjs` · `spec.mjs` · `plan.mjs` · `prove.mjs` · `render.mjs` · `live.mjs`) רצה ב-Node ובדפדפן; הסטודיו מדביק אותה בלי import/export.

## משפט רגיל
`sentence.mjs` — מנוע עיוור (אפס מילה עברית בקוד): רבים=ישות, יחיד=שדה, סמן «עם/יש/לכל», רשימת-ערכים
בסוגריים/לוכסן ⇒ ערך-מנוי, רמזי-צורה (תאריך/סכום/טלפון) מדאטה. ידע-השפה נקרא כדאטה מ-`machtzev/generator/{nl-lang,spec-lang}.data.json`
(קריאת-קובץ, לא import) ומצולם ל-`gen/lang.data.json`; בלי המחצב — הצילום. כל הנחה נכתבת ב«הבנתי כך», לא נבלעת.

## הכל-הכל (§21) — מה מחובר
| שכבה | איך |
|---|---|
| 569 פונקציות-JS | הוכחה-בריצה (Node + דפדפן), מוטבעות באפליקציה |
| 527 אטומי-דאטה JS | 292 הם הקבועים (T) של הפונקציות — `shelf.mjs` טוען אותם מאטום-הדאטה התאום, לא מקובץ-הבדיקה |
| 394 לוגיקה רק-ב-Dart | `prove-dart.mjs`: אותן דוגמאות, קובץ-מוכיח אחד לצורך, ריצה ב-Dart (`/home/user/dart/dart-sdk` או `$DART`); בסטודיו התוצאה ארוזה |
| 569 תאומי-Dart | אותם אטומים כמו ה-JS |
| 924 אטומי-תצוגה | `flutter.mjs` (`--flutter`): הספק ⇒ `app-ds.mjs` של המחצב בתהליך נפרד, פלט ל-`out/<slug>/flutter`, עץ-המחצב נשאר נקי (נבדק ב-git status). `site.mjs` (`--site`): מראה ל-buildsmart (`BUILDSMART`) + `flutter build web` (`FLUTTER`) ⇒ `out/<slug>/site` — אתר-Flutter רץ, בלי בינה |
| 64 אסינכרוניים | לא מחוברים (db/fs) — כתוב במלאי |
`inventory.mjs` סופר את כל זה מהדיסק בכל בנייה; המספרים בדוח, לא ביד.

## משפט ⇒ אתר-Flutter מלא (המנוע הטהור של המחצב, כל אטומי-התצוגה)
```bash
node gen/build.mjs gen/specs/tikim.txt --site   # משפט ⇒ ספק ⇒ HTML + מודולי-Dart + אתר ב-out/tikim/site
```
המשפט יכול לכלול «שלבים: א, ב, ג» (⇒ `| שלבים` בספק, פס-שלבים ב-Flutter, עמודת-שלב עם «›» ב-HTML) וקשרים
(שדה ששמו הוא שם ישות אחרת ⇒ בחירה מרשימה). הסביבה: Flutter SDK ב-`/home/user/flutter`, buildsmart ב-`/home/user/meir7651231-ui/buildsmart`.

## מה הוא לא עושה (בכוונה)
- לא נוגע ב-`new/`, לא ב-`machtzev/`, לא ב-`regen.mjs`, לא ב-`one.mjs`, לא ב-`gates.tsv`, לא ב-pins. (`--flutter` מריץ את `app-ds.mjs` כתהליך ומעביר את קבצי-הצד שלו ל-`out/`; העץ נקי אחרי.)
- לא מייבא שום קובץ של המחצב; קורא את קבצי-האטומים כדאטה ומריץ אותם. שום קובץ של המחצב לא מייבא אותו.
- לא כותב קוד-חישוב באפליקציה: כל חישוב הוא אטום שעבר את הדוגמאות בריצה. צורך בלי אטום מוכח מוצג «אין אטום מוכח».
- לא רץ אלא ביד.

## המחולל המלא בלי אדם באמצע (CI)
`.github/workflows/gen.yml`: כל push עם קובץ ב-`gen/specs/*.txt`, או Actions ⇒ gen ⇒ Run workflow עם שם+משפט ⇒
Flutter מותקן, buildsmart משוכפל, `node gen/build.mjs <ספק> --site` לכל ספק ⇒ `gh-pages/gen/<שם>/` (אתר) + `live.html` + `studio.html`.
כתובת (אחרי הפעלת Pages על ענף gh-pages): `https://meir7651231-ui.github.io/-ai-chat-server/gen/`.

## האשף
`wizard.mjs` ⇒ `out/wizard.html`: `mosad.data.json` (התוכנית המלאה למוסד חסידי כדאטה: אגפים ⇒ ישויות ⇒ שדות/שלבים, אוטומציות, פנים, חיבורים, הקשר)
כעץ-מתגים, הכל דלוק; מה שדלוק ⇒ ספק ⇒ אותה ליבה של הסטודיו בונה בדפדפן. ההקשר (מדינה · מוסד/מוצר · גודל · טלפון · חצר · שפה · שרת) = מתגים שמכבים ברירות-מחדל, לא שאלות.

## הפיכות של הידע (חבילות)
`mosad.data.json` **נגזר** תמיד מ-`mosad-build.mjs` על שלושה מקורות: `mosad.sentences.txt` (המשפטים) + `mosad.enrich.json` (העשרות-יד כדאטה)
+ `packs/*.json` (חבילות-ידע חצובות, כל שורה עם מוצא). לא עורכים אותו ביד.
- לבטל חבילה: `rm gen/packs/<id>.json && node gen/mosad-build.mjs` — הדאטה חוזר בדיוק למה שנשאר.
- לבטל את כל החבילות: `node gen/mosad-build.mjs --no-packs`. לבטל גם העשרות: `--no-enrich` ⇒ המשפטים בלבד.
- למדוד מה חבילה נתנה: `node gen/pass.mjs --no-flutter` לפני ואחרי (שאלות-עדשה פתוחות).

## ניתוק מלא (החזרת המצב לקדמותו)
```bash
git rm -r gen .github/workflows/gen.yml && git commit -m "gen: ניתוק"
```
או בלי commit: `rm -rf gen`. אין רישום ב-regen, אין שער, אין baseline, אין pin.
`node gen/detach.mjs --check` מוכיח את זה בכל רגע.
