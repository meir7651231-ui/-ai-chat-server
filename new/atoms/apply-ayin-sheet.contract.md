# חוזה · חוט apply-ayin-sheet
**תפקיד:** החלת עדכוני גיליון-העיניים (round-trip מהלגאסי, legacy:983-993) על
רשימת-תומכים — טהורה ואימוטבילית. לכל עדכון {supporterId, nameId, eyes?, done?,
paid?, answer?, lead?}: eyes השתנה ⇒ unshift ל-log {date,eyes,name} (+ספירה);
eyes/done ⇒ עדכון הרשומה ב-names; paid ⇒ ברמת-התיק; answer ⇒ unshift ל-answers
עם דה-דופ לפי note + קביעת answeredNote; lead כש-stage ∉ {eyes,answer,done} ⇒
stage='eyes'; ובסוף כל עדכון-שהוחל lastTouch=today. תומך/ת בלי ayin או בלי
עדכונים ⇒ מוחזר/ת כמו-שהוא/היא; nameId לא-קיים ⇒ העדכון כולו מדולג.
**קלט:** supporters[], upds[], today (ISO). **פלט:** {supporters, logged}.
**דוגמאות מחייבות (s1: ayin עם name n1 'משה' eyes=3, log=[], answers=[],
stage='new', today='2026-08-24'):**
‏upd {eyes:5, paid:true, answer:'התקבלה'} ⇒ logged=1 ·
log[0]={date:'2026-08-24',eyes:5,name:'משה'} · names[0].eyes=5 · paid=true ·
answers[0].note='התקבלה' · answeredNote='התקבלה' · lastTouch='2026-08-24' ·
‏upd חוזר {eyes:5} על התוצאה ⇒ logged=0 (אין שינוי-עיניים ⇒ אין log) ·
‏upd {answer:'התקבלה'} חוזר ⇒ answers לא גדל (דה-דופ) ·
‏upd {lead:true} על stage='new' ⇒ stage='eyes'; על stage='done' ⇒ נשאר 'done' ·
‏nameId='זר' ⇒ התומך לא נגוע (גם בלי lastTouch) · תומך בלי upds ⇒ אותה
הפניה (===) · המקור לא שונה (אימוטביליות).
**מוצא:** חולץ כלשונו מ-maor/src/lib/ayin.ts:502-546.
