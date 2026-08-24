# חוזה · חוט plan-add-name
**תפקיד:** תכנון הוספת-פריט לתיק-מעקב (ayin) — טהור ואימוטבילי. השם עובר trim;
ריק ⇒ שגיאה 'הקלידו שם לפני ההוספה'. dedup לפי שם-מנורמל (השקע normName) מול
a.names ⇒ שגיאה 'השם "<nm>" כבר ברשימה'. אחרת: names חדש = a.names + רשומה
{id, name:<trimmed>, eyes, done:false}. כשהמונה סופק (eyes !== '' וגם != null,
כולל 0) ⇒ מוחזר גם log חדש עם רשומה בראש: {date:isoToday(), eyes:+eyes, name}
(המרה מספרית ב-log; ב-names נשמר הערך כפי-שהוא). a הנכנס לא משתנה.
**שקעים (חוק-1):** normName(s)→מפתח-השוואה מנורמל · isoToday()→תאריך-ISO של
היום (השעון של הקורא — טוהר).
**קלט:** a ({names[], log[]}), rawName, eyes (number|''), id + שני השקעים.
**פלט:** {ok:true, names, log?} | {ok:false, error}.
**דוגמאות מחייבות (a.names=[{id:'n1',name:'משה לוי',eyes:3,done:false}],
a.log=[{date:'2026-08-01',eyes:3,name:'משה לוי'}] · normName=הסרת-רווחים ·
isoToday='2026-08-24'):**
‏rawName='  ' ⇒ {ok:false,error:'הקלידו שם לפני ההוספה'} ·
‏rawName='משה  לוי' ⇒ {ok:false,error:'השם "משה  לוי" כבר ברשימה'} (dedup מנורמל) ·
‏rawName=' דוד ', eyes='' ⇒ ok · names.length=2 ·
names[1]={id:'n2',name:'דוד',eyes:'',done:false} · אין מפתח log ·
‏rawName='רות', eyes=5 ⇒ ok · log.length=2 ·
log[0]={date:'2026-08-24',eyes:5,name:'רות'} (בראש, הישן אחריו) ·
‏rawName='חנה', eyes=0 ⇒ ok עם log (0 הוא מונה שסופק) · log[0].eyes=0 ·
‏a.names המקורי נשאר באורך 1 (אימוטביליות).
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:230-248 (normName/isoToday שוקעו).
