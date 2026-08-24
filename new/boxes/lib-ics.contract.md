# חוזה · קופסת-חיבורים "lib-ics" (מנוע ICS · RFC 5545)

**תפקיד:** קופסת-החיווט של `maor/src/lib/ics.ts` — ‏4 חוטי-הפורמט של קובץ-היומן
(ICS) מולחמים כאן במקום אחד: escaping · קיפול-שורות · בניית-קובץ · הורדה.
‏Google Calendar / Outlook / Apple בולעים את הקובץ בייבוא אחד.

**חשיפה (ממשק המקור אחד-לאחד — L4):**
- `icsEscape(s)⇒string` — escaping ‏RFC 5545 (‏\\ ; , \n). חוט ics-escape עובר-שקוף.
- `foldIcsLine(line)⇒string[]` — קיפול ל-≤75 אוקטטים (UTF-8, תו-עברי=2ב). עובר-שקוף.
- `buildIcs(occurrences, calName, now)⇒string` — קובץ-ICS שלם. החיווט מזריק לחוט
  את שני שכניו המיוצאים (icsEscape · foldIcsLine) כשקעים (חוק-3).
- `downloadIcs(filename, text, io)⇒void` — ⚠️ לא-טהור. שער-יציאה + DOM.

**שקעי-IO של downloadIcs (חוק-1/6 — מצב-מודול+ידיות-DOM מוזרקות, לא נצרבות):**
`io = { blocked, notify, createElement, createObjectURL, revokeObjectURL, setTimeout }`.
- `blocked⇒boolean` · `notify⇒(()=>void)|null` — שני שקעי guard-export
  (‏App→setExportBlocked; exportGate.ts:15-22). ברירת-מחדל (לא-חסום) ⇒ מותר.
- `createElement/createObjectURL/revokeObjectURL/setTimeout` — ידיות-הדפדפן
  (‏document/URL/window). ‏Blob = סטנדרט-שפה גלובלי, לא שקע.

**הכרעות-הקופסה (מילון, verbatim מהמקור):**
- `CAL_MIME='text/calendar;charset=utf-8'` — ics.ts:136; בלי BOM (ics.ts:132).
- `REVOKE_MS=5000` — ics.ts:139.
- **סדר-החיווט חתום:** `guardExport(...)` נקרא **לפני** `createElement` — חסום ⇒
  יוצאים בלי לגעת ב-DOM (המקור: `if (!guardExport()) return`, ics.ts:134).

**דוגמאות מחייבות** (now=`new Date(Date.UTC(2026,7,24,10,0,0))`):
1. `buildIcs([], 'לוח', now)` ⇒
   `'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n'`.
2. מופע-עם-שעה `{uid:'u1',title:'פגישה',date:'2026-08-24',time:'19:30'}` ⇒ הפלט
   מכיל `DTSTAMP:20260824T100000Z` · `DTSTART:20260824T193000` ·
   `DTEND:20260824T203000` · `SUMMARY:פגישה` (בלי DESCRIPTION/LOCATION).
3. גלגול-חצות: `time='23:30'` ⇒ `DTEND:20260825T003000`.
4. בלי-שעה: `time=''` ⇒ `DTSTART;VALUE=DATE:20260824` + `DTEND;VALUE=DATE:20260825`.
5. שעה-מושחתת: `'25:00'` (עובר-רגקס, Invalid Date) וגם `'9:00'` (נופל-רגקס) ⇒
   שניהם יום-שלם, אותן שורות כמו 4.
6. escaping דרך השקע: `notes='שורה1\nשורה2'`⇒`DESCRIPTION:שורה1\nשורה2` ·
   `location='אולם; ראשי'`⇒`LOCATION:אולם\; ראשי` · `title='א,ב'`⇒`SUMMARY:א\,ב`.
7. `icsEscape('a;b,c\\d\ne')` ⇒ `'a\\;b\\,c\\\\d\\ne'`.
8. downloadIcs מותר `(blocked:false)` ⇒ createElement('a') · href=object-url של
   Blob(mime=CAL_MIME) · a.download=filename · a.click() · setTimeout(revoke,5000).
9. downloadIcs חסום `(blocked:true, notify:spy)` ⇒ יוצא מיד; spy נקרא **פעם-אחת**;
   createElement **לא** נקרא (אפס נגיעת-DOM).

**מוצא:** `maor/src/lib/ics.ts` — icsEscape:26-32 · foldIcsLine:40-59 ·
buildIcs:96-130 · downloadIcs:133-140. חולץ כלשונו; שקעי-DOM/מצב-מודול מוזרקים.
