# חוזה · חוט org-cal-entries
**תפקיד:** שורות לוח-התרומות הכלל-ארגוני (legacy supCalAll) — לכל תומכת,
בסדר-התומכות: אירועי-התרומה (מהשקע), רישומי 🧿 גיליון-העיניים
('🧿 {eyes}' ועם name ‏' — {name}'), 📞 תשובות ('📞 תשובה: {note}') ו-🔁 nextTalk
('🔁 לדבר שוב'). כל שורה מקבלת name+spId של התומכת (ניווט). אירועי-לא-תרומה:
‏amount=0, cur=''. בסוף מסוננות שורות בלי date (falsy). אין מיון.
**שקעים (חוק-1):** supDonEvents(sp)→`[{date,amount,cur,src}]` — אירועי-התרומה
של תומכת (החוט sup-don-events, מחווט בקופסה).
**קלט:** supporters=[{id,name,ayin?:{log?,answers?,nextTalk?},…}] + השקע.
**פלט:** `[{date,amount,cur,src,name,spId}]`.
**דוגמאות מחייבות (שקע מדומה: מחזיר [{date:'2026-01-05',amount:100,cur:'₪',src:'תרומה'}]
ל-sp1 בלבד, [] לאחרים):**
- ‏sp1={id:'s1',name:'רות'} ⇒ [{date:'2026-01-05',amount:100,cur:'₪',src:'תרומה',name:'רות',spId:'s1'}]
- ‏sp2={id:'s2',name:'דנה',ayin:{log:[{date:'2026-02-01',eyes:'ה.כ',name:'רות'}],
  answers:[{date:'2026-03-01',note:'יחזור'}],nextTalk:'2026-04-01'}} ⇒ 3 שורות
  בסדר: '🧿 ה.כ — רות' · '📞 תשובה: יחזור' · '🔁 לדבר שוב', כולן amount=0,
  cur='', name='דנה', spId='s2'
- רישום-עיניים בלי name ‏({date:'2026-02-02',eyes:'ב.ל'}) ⇒ src='🧿 ב.ל' (בלי מקף)
- רישום-עיניים עם date:'' ⇒ מסונן (לא מופיע בפלט)
- ‏supporters=[] ⇒ [] · תומכת בלי ayin ובלי אירועי-תרומה ⇒ אפס שורות
**מוצא:** חולץ כלשונו מ-maor/src/components/supporters/lib.ts:326-337
(legacy supCalAll ‏2928-2937); supDonEvents השכן שוקע.
