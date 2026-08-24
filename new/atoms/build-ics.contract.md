# חוזה · חוט build-ics
**תפקיד:** בניית קובץ ICS ‏(RFC 5545) שלם ממופעי-יומן קונקרטיים. כותרת קבועה
(‏VCALENDAR · VERSION:2.0 · ‏PRODID:-//maor-system//he// · GREGORIAN · PUBLISH ·
‏X-WR-CALNAME דרך שקע-icsEscape), ואז VEVENT לכל מופע: ‏UID (מנוקה) ·
‏DTSTAMP אחיד מ-now המוזרק (טהור — בלי Date.now) · זמנים:
- שעה תקינה (רגקס ‎^\d{2}:\d{2}$ **וגם** ‏Date חוקי — 🐛 נחיל-עמוק 13.8:
  ‏'25:00'/'12:60' עברו את הרגקס) ⇒ ‏DTSTART מקומי-צף ‏YYYYMMDDTHHMMSS +
  ‏DTEND שעה אחת אחריו (כולל גלגול-חצות).
- אחרת (ריק / '9:00' / שעה בלתי-אפשרית) ⇒ אירוע יום-שלם:
  ‏DTSTART;VALUE=DATE:YYYYMMDD + ‏DTEND;VALUE=DATE של יום-המחרת.
‏SUMMARY תמיד; ‏DESCRIPTION/LOCATION רק כשקיימים. סיום END:VCALENDAR. כל שורה
עוברת שקע-foldIcsLine (קיפול-75-אוקטטים), החיבור ב-CRLF ‏+ CRLF סוגר.
**שקעים (חוק-1):** ‏icsEscape(s)⇒string — ‏escaping לפי RFC 5545 ‏(\\ ; , \n;
האטום ics-escape) · ‏foldIcsLine(line)⇒string[] — קיפול-שורה ל-≤75 אוקטטים.
העוזרים basicDate/basicLocal/stampUtc/nextIso היו פרטיים בקובץ-המקור — נשארו באטום.
**קלט:** occurrences ‏{uid,title,date,time,notes?,location?}[] · calName ·
now (‏Date) · שני השקעים. **פלט:** מחרוזת-ICS.
**דוגמאות מחייבות** (שקעי-בדיקה: ‏icsEscape אמיתי-מינימלי; ‏foldIcsLine=זהות
‏line⇒[line] — הקיפול נבדק באטום שלו; ‏now=Date.UTC(2026,7,24,10,0,0)):
1. אפס מופעים, calName='לוח' ⇒
   'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n'.
2. מופע עם שעה: ‏{uid:'u1',title:'פגישה',date:'2026-08-24',time:'19:30'} ⇒
   בין השורות: 'DTSTAMP:20260824T100000Z' · 'DTSTART:20260824T193000' ·
   'DTEND:20260824T203000' · 'SUMMARY:פגישה'; אין DESCRIPTION/LOCATION.
3. גלגול-חצות: ‏time='23:30' ב-'2026-08-24' ⇒ ‏DTEND:20260825T003000.
4. בלי שעה: ‏time='' ב-'2026-08-24' ⇒ ‏'DTSTART;VALUE=DATE:20260824' +
   ‏'DTEND;VALUE=DATE:20260825' (יום-המחרת).
5. שעה מושחתת: ‏'25:00' (עובר-רגקס, ‏Invalid Date) וגם '9:00' (נופל-רגקס) ⇒
   שניהם יום-שלם — אותן שורות כמו בדוגמה 4.
6. ‏notes='שורה1\nשורה2' ו-location='אולם; ראשי' ⇒
   ‏'DESCRIPTION:שורה1\\nשורה2' (escaping דרך השקע) ·
   ‏'LOCATION:אולם\\; ראשי'; וכן title עם פסיק: 'א,ב' ⇒ 'SUMMARY:א\\,ב'.
**מוצא:** maor/src/lib/ics.ts:96-132 (‏buildIcs). חולץ כלשונו; שני השכנים
המיוצאים (icsEscape · foldIcsLine) שוקעו, הפרטיים נשארו.
