# חוזה · חוט coordinator-boxes
**תפקיד:** הקופות של רכז — סינון מערך-קופות לפי מזהה-רכז (‏coordinatorId
שווה-בדיוק), בשמירת סדר-המקור. מערך חדש; לא נוגע בקלט.
**קלט:** ‏boxes ‏[{coordinatorId,…}] · coordId (string).
**פלט:** מערך-הקופות של הרכז (יתכן ריק).
**דוגמאות מחייבות** (‏B=[{id:'b1',coordinatorId:'c1'},{id:'b2',coordinatorId:'c2'},
{id:'b3',coordinatorId:'c1'}]):
1. ‏(B,'c1') ⇒ ‏[b1,b3] — שתי הקופות, בסדר-המקור.
2. ‏(B,'c2') ⇒ ‏[b2].
3. ‏(B,'cX') ⇒ ‏[] (רכז לא-מוכר).
4. ‏([],'c1') ⇒ ‏[] (אין קופות כלל).
**מוצא:** maor/src/components/tzedaka/lib.ts:56-59 (‏coordinatorBoxes).
אפס שקעים — עצמאי מלא.
