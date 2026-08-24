# חוזה · חוט find-caller
**תפקיד:** זיהוי-שיחה-נכנסת (screen-pop) — התאמת מספר-מתקשר לאיש-קשר שמור,
לפי סדר-עדיפות קשיח: משפחה (ראשי/נוסף) → בן-משפחה → תורם → מתנדב → רכז.
מפתח קצר מ-6 ספרות ⇒ ‏null (הימנעות מ-false-positive). בלי התאמה ⇒ ‏null.
**שקע (חוק-1):** ‏phoneKey(raw) ⇒ מחרוזת — מפתח-השוואת-טלפון (החוט phone-key:
ספרות בלבד, בניכוי 00/972 ואפסים מובילים).
**קלט:** ‏db (עם ‏families·supporters חובה; ‏volunteers·tzCoordinators רשות) ·
‏raw (המספר הנכנס) · ‏phoneKey.
**פלט:** ‏{kind, name, phone, id, view, famId?} או ‏null.
**דוגמאות מחייבות** (‏phoneKey-מזויף לפי חוזה החוט המשותף):
1. משפחה ‏{id:'f1', name:'כהן', phone:'0501234567'} + ‏raw='+972 50-123-4567' ⇒
   ‏{kind:'family', name:'כהן', phone:'0501234567', id:'f1', view:'families', famId:'f1'}.
2. בן-משפחה ‏{id:'m1', first:'דוד', phone:'0529990001'} במשפחת 'לוי' ⇒
   ‏{kind:'member', name:'דוד · לוי', …, view:'families', famId:'f2'}.
3. עדיפות: אותו מספר גם למשפחה וגם לתורם ⇒ המשפחה מנצחת (kind='family').
4. תורם ‏{id:'s1', name:'רוזן', phone:'0537770002'} ⇒ ‏view='supporters' (בלי famId).
5. מתנדב ⇒ ‏view='shop7'; רכז ⇒ ‏view='tzedaka'.
6. ‏raw='12345' (מפתח < 6 ספרות) ⇒ ‏null — גם כשמספר זהה שמור.
7. ‏db בלי ‏volunteers/tzCoordinators (undefined) + מספר לא-מוכר ⇒ ‏null בלי קריסה.
**מוצא:** maor/src/lib/callerId.ts:70-112 (‏findCaller — שילוב-טלפוני, PR ‏#158).
השכן ‏phoneKey הפך לשקע (חוק-1).
