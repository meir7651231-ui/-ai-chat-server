# חוזה · חוט filter-ayin-board
**תפקיד:** סינון מסך-הטיפול של "העין" — טקסט-חופשי + סטטוס + שלב. טהור.
סדר-הדינים על כל פריט: ‏status='wait' ⇒ ‏done נופל · ‏status='done' ⇒ רק ‏done ·
‏status=null ⇒ שניהם · ‏stage נתון ⇒ רק פריטים באותו שלב · ‏q ריק (אחרי
נרמול) ⇒ עובר · אחרת: החיפוש על צירוף ‏supporter+name+note (מופרדים ברווח),
שני הצדדים דרך שקע-normSearch — הכלה (includes) על הטקסט המנורמל.
**שקעים (חוק-1 — קריאת-השכן הוזרקה):**
- ‏normSearch(t) ⇒ ‏string — נרמול-חיפוש-עברי: ‏lowercase, הסרת-ניקוד,
  אותיות-סופיות ⇒ רגילות (ך⇒כ, ם⇒מ, ן⇒נ, ף⇒פ, ץ⇒צ), הסרת גרשיים/מקפים,
  ‏trim (האטום norm-search; מקור: validate.ts:51).
**קלט:** ‏items {supporter,name,note,done,stage}[] · q · status (null|'wait'|'done') ·
stage (null|שלב) · השקע. **פלט:** ‏items מסוננים (הסדר נשמר; הקלט לא משתנה).
**דוגמאות מחייבות** (‏items: ‏i1{supporter:'רבקה כהן', name:'עיניים',
note:'טלפון דחוף', done:false, stage:'call'} · ‏i2{supporter:'שרה לוי',
name:'ברכה', note:'', done:true, stage:'visit'} · ‏i3{supporter:'לאה',
name:'עיניים', note:'', done:false, stage:'visit'}; שקע נאמן-למקור):
1. ‏q='', status='wait', stage=null ⇒ ‏[i1,i3] — העשוי נופל.
2. ‏q='', status='done', stage=null ⇒ ‏[i2].
3. ‏q='', status=null, stage='visit' ⇒ ‏[i2,i3].
4. ‏q='', status=null, stage=null ⇒ שלושתם.
5. ‏q='טלפונ' (בלי סופית) ⇒ ‏[i1] — 'טלפון' שבהערה מנורמל ן⇒נ ונתפס.
6. שילוב: ‏status='wait' + stage='visit' ⇒ ‏[i3].
**מוצא:** maor/src/lib/ayin.ts:358-379 (‏filterAyinBoard — "סינון מסך-הטיפול…
טהור"). ‏normSearch שוקע (חוק-1).
