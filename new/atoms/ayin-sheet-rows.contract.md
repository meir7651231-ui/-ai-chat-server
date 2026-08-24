# חוזה · חוט ayin-sheet-rows
**תפקיד:** שורות ייצוא-CSV של גיליון-העיניים — שורה לכל שם בתיק-עין של תומכת.
שורה ראשונה = כותרת קבועה (8 עמודות, מיוצאת גם היא: `AYIN_SHEET_HEADER`).
תומכת בלי `ayin` מדולגת. פר-שורה: שם-תומכת · טלפון ('' כשחסר) · שם-למסירה ·
עיניים ('' כש-eyes ריק/null, אחרת String — כולל 0⇒"0") · נמסר `n.done`⇒כן/לא ·
שולם `a.paid`⇒כן/לא (ברמת-התיק) · תשובה = `answers[0].note` ואם אין תשובות אז
`answeredNote` (פסיקים→רווח — הגנת-CSV) · עופרת-בוצעה = 'כן' כש-`stage` ∈
{eyes, answer, done}, אחרת 'לא'.
**קלט:** `supporters` — מערך תומכות (שדות: name, phone?, ayin?{stage, paid,
answers[{note}], answeredNote?, names[{name, eyes, done}]}).
**פלט:** `string[][]` — כותרת + שורת-נתונים לכל שם.
**שקעים:** אין — חוט עצמאי (הכותרת מוטבעת ומיוצאת מאותו קובץ).
**דוגמאות מחייבות:**
1. ‏`[]` ⇒ מערך עם שורת-כותרת בלבד (אורך 1, 8 עמודות).
2. תומכת בלי `ayin` ⇒ לא מוסיפה שורות (נשארת כותרת בלבד).
3. ‏{name:'רות', phone:'050-1', ayin:{stage:'eyes', paid:true,
   answers:[{note:'שולם,מזומן'}], names:[{name:'דוד', eyes:3, done:true}]}} ⇒
   ‏['רות','050-1','דוד','3','כן','כן','שולם מזומן','כן'] (פסיק→רווח; stage 'eyes'⇒עופרת 'כן').
4. ‏{name:'לאה', ayin:{stage:'new', paid:false, answers:[], answeredNote:'אין מענה',
   names:[{name:'יוסי', eyes:0, done:false},{name:'מרים', eyes:'', done:false}]}} ⇒
   2 שורות: ‏['לאה','','יוסי','0','לא','לא','אין מענה','לא'] (eyes=0⇒"0"; אין answers⇒answeredNote)
   ו-‏['לאה','','מרים','','לא','לא','אין מענה','לא'] (eyes ריק⇒'').
5. כשיש `answers[0]` — היא גוברת על `answeredNote`: ‏answers:[{note:'כן'}] +
   ‏answeredNote:'ישן' ⇒ עמודת-תשובה 'כן'.
**מוצא:** maor/src/lib/ayin.ts:380-418 (‏AYIN_SHEET_HEADER + ayinSheetRows,
‏legacy:196-198). חולץ כלשונו; הכותרת — שכנת-קובץ — הוטבעה באטום.
