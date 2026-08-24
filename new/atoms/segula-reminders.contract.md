# חוזה · חוט segula-reminders
**תפקיד:** מתאריך-התחלה ⇒ רשימת תזכורות-סגולה מדורגות. כל דילוג `N` מוסיף `N`
ימים לתאריך-ההתחלה. דטרמיניסטי (בלי `Date.now`), עוגן-צהריים-מקומי. הדילוג
הגדול ביותר מסומן `final:true` (יעד-הסיום).
**קלט:**
- `startIso` — תאריך-התחלה ISO (`'YYYY-MM-DD'`).
- `offsets` — מערך-דילוגים (מספרים). **ברירת-מחדל מוטבעת** `[1,7,21,35,40]`
  (זהה לאטום segula-offsets — מוטבע ולא מיובא, חוק-1).
**פלט:** מערך `{ day, date, final }` בסדר הדילוגים; `date` = ISO `'YYYY-MM-DD'`,
`final` = `day === max(offsets)`.
**התנהגות:** `base = new Date(startIso+'T12:00:00')`; לכל `day`: מוסיף ימים
דרך `setDate`, וממיר חזרה ל-ISO מרכיבים מקומיים (`getFullYear/getMonth/getDate`).
**דוגמאות מחייבות (ברירת-מחדל, `startIso='2026-08-24'`):**
- אורך הפלט → `5`
- ‏`day 1` → `{day:1, date:'2026-08-25', final:false}`
- ‏`day 7` → `{day:7, date:'2026-08-31', final:false}`
- ‏`day 21` → `{day:21, date:'2026-09-14', final:false}`
- ‏`day 35` → `{day:35, date:'2026-09-28', final:false}`
- ‏`day 40` → `{day:40, date:'2026-10-03', final:true}` (גדול-ביותר ⇒ סיום)
**דוגמת offsets מותאם:** `segulaReminders('2026-01-01',[3])` → `[{day:3,date:'2026-01-04',final:true}]`
**מוצא:** maor/src/components/supporters/lib.ts:324-337 (`segulaReminders`).
