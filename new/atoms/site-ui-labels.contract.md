# חוזה · אטום-נתונים site-ui-labels
**מהות:** תוויות-הממשק המובנות של האתר-הציבורי פר-שפה (כותרות-סעיף, כפתורים,
כיוון-כתיבה) — קבועות, לא-מהקונפיג. ‏3 שפות: he · en · yi.
**שם:** במקור ‏SITE_UI; נקרא כאן ‏site-ui-labels כי השם ‏site-ui שמור
לחוט-הפותר (הפונקציה ‏siteUi שמקבלת את המילון הזה בשקע-הנתונים שלה).
## ערבויות
1. בדיוק 3 שפות: he·en·yi, ולכולן **אותה קבוצת-מפתחות** בת 16 מפתחות
   (donate·contact·enter·services·story·news·gallery·campaign·raised·goal·
   daysLeft·call·whatsapp·email·poweredBy·dir).
2. הערכים verbatim מהמקור; דוגמאות מחייבות:
   ‏he.donate='לתרומה' · ‏en.donate='Donate' · ‏yi.donate='שפּענדן' ·
   ‏he.poweredBy='מופעל על-ידי מאור' · ‏en.raised='Raised' · ‏yi.goal='ציל'.
3. כיווני-כתיבה: ‏he.dir='rtl' · ‏en.dir='ltr' · ‏yi.dir='rtl'.
**מוצא:** maor/src/lib/publicSite.ts:13-34 (הקבוע ‏SITE_UI, "תוויות-ממשק
מובנות פר-שפה (כותרות-סעיף, כפתורים) — לא-מהקונפיג, קבועות").
