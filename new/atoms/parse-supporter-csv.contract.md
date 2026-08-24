# חוזה · חוט parse-supporter-csv
**תפקיד:** פענוח טקסט-CSV גולמי לשורות-ייבוא תומכות — חוט-הרכבה טהור:
מעביר את הטקסט דרך parseCsv (טקסט⇒רשת-תאים) ואת התוצאה **כמות-שהיא** דרך
parseSupporterGrid (רשת⇒שורות-ייבוא), ומחזיר את פלט-הרשת ללא נגיעה.
**שקעים (חוק-1 — קריאות-השכן הוזרקו כפרמטרים):**
- ‏parseCsv(text) ⇒ ‏string[][] — פירוק CSV/TSV עם מרכאות (החוט parse-csv).
- ‏parseSupporterGrid(rows) ⇒ שורות-ייבוא — פענוח-הרשת (החוט parse-supporter-grid;
  הקופסה מחווטת אותו סגור על שקעיו-שלו).
**קלט:** text מחרוזת + 2 השקעים. **פלט:** בדיוק הערך ש-parseSupporterGrid מחזיר.
**דוגמאות מחייבות (שקעי-מיני: parseCsv = פיצול שורות/פסיקים;
parseSupporterGrid = כל שורה מלבד הראשונה ⇒ {name: תא-0}):**
1. ‏'שם,טלפון\nדוד,050\nשרה,052' → ‏[{name:'דוד'}, {name:'שרה'}].
2. ‏'' → [] (הרשת [['']] נבלעת בשקע-הרשת).
3. הרכבה מדויקת (עם שקעי-ריגול): ‏parseCsv מקבל **בדיוק** את הטקסט; ‏
   parseSupporterGrid מקבל **בדיוק** (===) את פלט-parseCsv; ערך-ההחזרה הוא
   **בדיוק** (===) פלט-parseSupporterGrid.
**מוצא:** maor/src/components/supporters/lib.ts:506-533 (parseSupporterCsv);
השכנים parseCsv/parseSupporterGrid הפכו לשקעים (חוק-1).
