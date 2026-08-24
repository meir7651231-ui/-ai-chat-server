# חוזה · חוט build-tz-grid
**תפקיד:** הגריד החודשי (לועזי/עברי) של לוח-הצדקה הייעודי — wrapper דק שמאציל
במלואו לבונה-הגריד הגנרי, עם האירועים הייעודיים (tzEvents) **בלבד** — הבידוד
של מודול-הקופות (אין db.events) נשמר בכך שהקופסה מחווטת אליו רק tzEvents.
האטום עצמו עיוור לתוכן: מעביר את שלושת הארגומנטים כמות-שהם ומחזיר את
תוצאת-השקע כמות-שהיא (===). ‏re-export של DAY_NAMES במקור = חיווט — לא כאן.
**שקעים (חוק-1 — קריאת-השכן הוזרקה כפרמטר רביעי):**
- ‏buildMonthGrid(events, anchorIso, hebMode)⇒MonthGrid — הבונה הגנרי
  (במקור: lib/monthGrid.ts; פלטו ‏{cells, label, subLabel, prevIso, nextIso}).
**קלט:** ‏tzEvents (מערך ‏{date,…}) · ‏anchorIso · ‏hebMode (boolean) · השקע.
**פלט:** בדיוק מה שהשקע החזיר.
**דוגמאות מחייבות:**
1. שקע-מרגל שמחזיר זקיף ‏G={cells:[]} ⇒ ‏buildTzGrid(ev,'2026-08-24',false,spy)===G
   (אותה רפרנס — לא עותק).
2. המרגל קיבל בדיוק ‏[ev, '2026-08-24', false] — ו-ev באותה רפרנס (===).
3. ‏hebMode=true מועבר כמות-שהוא: המרגל רואה ‏true.
4. שקע-מחשב ‏(evs)=>({n:evs.length}) עם 3 אירועים ⇒ ‏{n:3}.
**מוצא:** maor/src/components/tzedaka/lib.ts:302-307 (‏buildTzGrid — "wrapper דק
על הגנרי המשותף ב-lib/monthGrid; החתימה נשמרת כמות שהיא").
