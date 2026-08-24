# חוזה · חוט renew-targets
**תפקיד:** סינון שורות-הרישום-מחדש למועמדי הרישום-ההמוני לשנה הבאה:
רק מי שהוחלט עליו "ממשיך" (‏decision==='yes') **ועדיין לא נרשם**
(‏!renewed). מוחזר מערך חדש (filter); הסדר המקורי נשמר; הקלט לא משוכתב.
**קלט:** ‏rows — מערך שורות ‏{decision: 'yes'|'no'|'hold'|'', renewed: boolean, …}.
**פלט:** תת-מערך של אותן שורות (אותן הפניות).
**דוגמאות מחייבות:**
1. ‏[{id:1,decision:'yes',renewed:false}, {id:2,decision:'no',renewed:false},
   {id:3,decision:'yes',renewed:true}, {id:4,decision:'hold',renewed:false}]
   ⇒ ‏[שורה-1] בלבד — 'no'/'hold' בחוץ, וגם 'yes' שכבר-נרשם בחוץ.
2. ‏[{id:1,decision:'yes',renewed:false}, {id:2,decision:'yes',renewed:false}]
   ⇒ שתי השורות, באותו סדר.
3. ‏[{id:1,decision:'',renewed:false}] ⇒ ‏[] — טרם-הוחלט אינו מועמד.
4. ‏[] ⇒ ‏[].
5. immutability: אחרי דוגמה 1, המערך הנכנס עדיין באורך 4 והפלט הוא מערך אחר
   (‏out!==rows), אך השורה המוחזרת היא **אותה הפניה** (‏out[0]===rows[0]).
**מוצא:** maor/src/components/courses/reenroll-lib.ts:198-206 (‏renewTargets —
"מי מיועד לרישום המוני — 'ממשיך' שעדיין לא נרשם").
