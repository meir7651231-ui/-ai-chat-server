# חוזה · חוט export-allowed
**תפקיד:** ההכרעה הטהורה של שער יציאת-המידע (נקודת-החנק היחידה לפני כל
הורדה/הדפסה/העתקה): מותר ⇔ לא-חסום. חוזה-הדגלים נשמר — **חסר = מותר**, רק
חסימה מפורשת (true) סוגרת. במקור `blocked` הוא מצב-מודול שנקבע מ-App לפי
הקונפיג-האפקטיבי של העובדת (`core.export:false` בכרטיס-העובד); החזקת-המצב
וההתרעה (toast) הן חיווט-קופסה — האטום מכריע בלבד.
**קלט:** blocked — דגל-חסימה (boolean/חסר). **פלט:** boolean — האם מותר לייצא.
**דוגמאות מחייבות:**
1. ‏exportAllowed(false) ⇒ ‏true (לא-חסום — מותר).
2. ‏exportAllowed(true) ⇒ ‏false (המנהל חסם — כל נתיב-יציאה עוצר).
3. ‏exportAllowed(undefined) ⇒ ‏true (חסר-דגל = ברירת-המחדל מותר — משתמשים
   רגילים אינם מושפעים).
4. ‏exportAllowed(null) ⇒ ‏true.
5. הפלט תמיד boolean אמיתי: ‏exportAllowed(0) ⇒ ‏true (typeof 'boolean').
**מוצא:** maor/src/lib/exportGate.ts:25-32 (‏exportAllowed — "האם יציאת-מידע
מותרת כרגע; חסר-דגל/ברירת-מחדל ⇒ true"). ‏setExportBlocked/guardExport (המצב
וה-toast) נשארים לקופסה.
